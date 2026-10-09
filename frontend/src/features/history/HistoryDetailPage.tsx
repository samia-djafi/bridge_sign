import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registry } from '@/services/registry';
import { ConversationMessage as MessageType, ConversationSession } from '@/types/domain';
import { StatusBar } from '@/components/domain/StatusBar';
import { ConversationMessage } from '@/components/domain/ConversationMessage';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { formatDateFull, formatDuration } from '@/lib/time';
import { downloadFile } from '@/lib/download';
import { useUiStore } from '@/stores/uiStore';

export const HistoryDetailPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { addToast } = useUiStore();

  const [session, setSession] = useState<ConversationSession | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!sessionId) return;
      try {
        const s = await registry.sessions.get(sessionId);
        if (!s) {
          navigate('/app/history');
          return;
        }
        setSession(s);
        const ms = await registry.sessions.listMessages(sessionId);
        setMessages(ms);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId, navigate]);

  const handleExport = async (format: 'txt' | 'json') => {
    if (!sessionId || !session) return;
    const data = await registry.sessions.exportSession(sessionId);

    if (format === 'json') {
      downloadFile(
        `transcript_${session.title.replace(/\s+/g, '_')}.json`,
        JSON.stringify(data, null, 2),
        'application/json'
      );
    } else {
      const lines = messages.map(
        (m) =>
          `[${new Date(m.createdAt).toLocaleTimeString()}] ${
            m.direction === 'sign_to_language' ? 'LSA (Signeur)' : 'Interlocuteur'
          }: ${m.outputs[session.spokenLang]} (Glose: ${m.gloss.join(' ')})`
      );
      const text = `TRANSCRIPTION LSA BRIDGE\nTitre: ${session.title}\nDate: ${new Date(
        session.startedAt
      ).toLocaleString()}\n\n${lines.join('\n')}`;
      downloadFile(`transcript_${session.title.replace(/\s+/g, '_')}.txt`, text, 'text/plain');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !session) {
    return <div className="p-8 text-center text-app-muted">Chargement…</div>;
  }

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={session.title} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        {/* Detail Header & Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app-border pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/history')}
              iconStart={<ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />}
            >
              Retour
            </Button>
            <div>
              <h2 className="text-xl font-bold text-app-text">{session.title}</h2>
              <p className="text-xs text-app-muted mt-0.5">
                {formatDateFull(session.startedAt, i18n.resolvedLanguage)} · Durée :{' '}
                {formatDuration(session.activeMs)} · {session.messageCount} messages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              iconStart={<Printer className="w-4 h-4" />}
            >
              Imprimer
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleExport('txt')}
              iconStart={<Download className="w-4 h-4" />}
            >
              Exporter
            </Button>

            {session.status !== 'ended' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/app/workspace/${session.id}`)}
              >
                Reprendre
              </Button>
            )}
          </div>
        </div>

        {/* Read-only Transcript Messages */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-app-muted border border-dashed border-app-border rounded-card">
              Aucun message dans cette conversation.
            </div>
          ) : (
            messages.map((msg) => (
              <ConversationMessage
                key={msg.id}
                message={msg}
                onReplaySigns={() => {
                  addToast({ message: 'Mode lecture de signes', type: 'status' });
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
