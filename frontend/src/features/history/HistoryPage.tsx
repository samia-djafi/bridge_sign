import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registry } from '@/services/registry';
import { ConversationSession } from '@/types/domain';
import { useUiStore } from '@/stores/uiStore';
import { StatusBar } from '@/components/domain/StatusBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  History,
  Search,
  HardDrive,
  Trash2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/time';

export const HistoryPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useUiStore();

  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<ConversationSession | null>(null);
  const [storageBannerDismissed, setStorageBannerDismissed] = useState(false);

  const loadSessions = async () => {
    const list = await registry.sessions.list();
    setSessions(list);
  };

  useEffect(() => {
    document.title = `${t('nav.history')} — ${t('app.name')}`;
    loadSessions();
  }, [t]);

  const handleDeleteWithUndo = async (session: ConversationSession) => {
    setSessionToDelete(null);
    const undo = await registry.sessions.softDelete(session.id);
    await loadSessions();

    addToast({
      message: t('history.deletedToast', 'Conversation supprimée'),
      type: 'status',
      durationMs: 5000,
      action: {
        label: t('history.undo', 'Annuler'),
        onClick: async () => {
          await undo();
          await loadSessions();
        },
      },
    });
  };

  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.context.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={t('nav.history', 'Historique')} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-app-text">
            {t('history.title', 'Historique des conversations')}
          </h2>
          <p className="text-sm text-app-muted mt-1">
            Retrouvez et réécoutez vos échanges précédents.
          </p>
        </div>

        {/* Local Storage Banner */}
        {!storageBannerDismissed && (
          <div className="p-3.5 rounded-card bg-app-surface border border-app-border flex items-center justify-between gap-3 text-xs text-app-muted shadow-1">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-app-primary-strong shrink-0" />
              <span>{t('history.storageNote', 'Les conversations sont enregistrées uniquement sur cet appareil.')}</span>
            </div>
            <button
              type="button"
              onClick={() => setStorageBannerDismissed(true)}
              className="text-xs font-semibold text-app-muted hover:text-app-text"
            >
              Masquer
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-app-muted absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('history.searchPlaceholder', 'Rechercher dans l’historique…')}
            className="w-full h-11 ps-11 pe-4 rounded-control border border-app-border-strong bg-app-surface text-app-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong shadow-1"
          />
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <EmptyState
            icon={<History className="w-6 h-6" />}
            title={t('history.empty', 'Aucune conversation enregistrée.')}
            description="Démarrez un premier échange pour le retrouver ici."
            action={
              <Button variant="primary" size="md" onClick={() => navigate('/app/new')}>
                Démarrer une conversation
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-card bg-app-surface border border-app-border hover:border-app-border-strong transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-1"
              >
                <div
                  className="flex items-start gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => navigate(`/app/history/${s.id}`)}
                >
                  <div className="w-10 h-10 rounded-control bg-app-surface-2 flex items-center justify-center shrink-0 text-app-primary-strong mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-base text-app-text truncate">{s.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-app-muted mt-1">
                      <span>{t(`contexts.${s.context}`)}</span>
                      <span>•</span>
                      <span>{s.spokenLang.toUpperCase()} ↔ LSA</span>
                      <span>•</span>
                      <span className="font-mono">
                        {t('history.messagesCount', { count: s.messageCount || 0 })}
                      </span>
                      <span>•</span>
                      <span>{formatRelativeTime(s.startedAt, i18n.resolvedLanguage)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {s.status === 'active' || s.status === 'paused' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/app/workspace/${s.id}`)}
                    >
                      {t('dash.resume', 'Reprendre')}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/app/history/${s.id}`)}
                      iconEnd={<ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />}
                    >
                      Détails
                    </Button>
                  )}

                  <button
                    type="button"
                    aria-label="Supprimer la conversation"
                    onClick={() => setSessionToDelete(s)}
                    className="p-2 text-app-muted hover:text-app-error rounded-control hover:bg-app-surface-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={sessionToDelete !== null}
        onClose={() => setSessionToDelete(null)}
        title={t('history.deleteConfirmTitle', 'Supprimer cette conversation ?')}
        maxWidth="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSessionToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (sessionToDelete) handleDeleteWithUndo(sessionToDelete);
              }}
            >
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-sm text-app-muted">
          {t(
            'history.deleteConfirmText',
            'Cette action peut être annulée pendant 5 secondes.'
          )}
        </p>
      </Modal>
    </div>
  );
};
