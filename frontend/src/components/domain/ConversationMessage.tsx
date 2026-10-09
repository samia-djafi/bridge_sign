import React, { useState } from 'react';
import { ConversationMessage as MessageType, SpokenLang } from '@/types/domain';
import { ConfidenceIndicator } from '@/components/ui/ConfidenceIndicator';
import { AudioButton } from './AudioButton';
import { SignSequenceStrip } from './SignSequenceStrip';
import { IconButton } from '@/components/ui/IconButton';
import { Copy, Edit2, Info, Video, Check } from 'lucide-react';
import { formatTimeOnly } from '@/lib/time';
import { useTranslation } from 'react-i18next';

export interface ConversationMessageProps {
  message: MessageType;
  onReplaySigns?: (gloss: string[]) => void;
  onEditMessage?: (id: string, newOutputs: MessageType['outputs']) => void;
  className?: string;
}

export const ConversationMessage: React.FC<ConversationMessageProps> = ({
  message,
  onReplaySigns,
  onEditMessage,
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const [displayLang, setDisplayLang] = useState<SpokenLang>(message.displayLang);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.outputs[displayLang] || '');
  const [copied, setCopied] = useState(false);

  const isSign = message.direction === 'sign_to_language';
  const isRtl = displayLang === 'ar';
  const textContent = isEditing ? editText : message.outputs[displayLang] || '';

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveEdit = () => {
    if (onEditMessage) {
      const updatedOutputs = {
        ...message.outputs,
        [displayLang]: editText,
      };
      onEditMessage(message.id, updatedOutputs);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`flex flex-col w-full my-3 ${
        isSign ? 'items-start' : 'items-end'
      } ${className}`}
    >
      <div
        className={`flex flex-col max-w-[92%] md:max-w-[80%] rounded-card p-4 transition-all ${
          isSign
            ? 'bg-app-surface border border-app-border-strong text-app-text shadow-1'
            : 'bg-app-primary-soft border border-app-primary-strong/20 text-app-text shadow-1'
        }`}
      >
        {/* Top Meta Row */}
        <div className="flex items-center justify-between gap-3 text-xs text-app-muted border-b border-app-border/60 pb-2 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span aria-hidden="true" className="text-sm select-none">
              {isSign ? '🤟' : '🗣️'}
            </span>
            <span>
              {isSign
                ? t('timeline.fromLsa', 'Traduit de la LSA')
                : t('timeline.fromSpeech', 'Message transmis')}
            </span>
            {message.edited && (
              <span className="px-1.5 py-0.2 bg-app-surface-2 text-app-muted rounded-pill text-[10px]">
                {t('timeline.edited', 'Modifié')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle chips */}
            <div className="flex items-center gap-0.5 bg-app-surface-2/80 p-0.5 rounded-control text-[11px] font-semibold">
              {(['fr', 'ar', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setDisplayLang(l)}
                  className={`px-1.5 py-0.5 rounded-control uppercase transition-colors ${
                    displayLang === l
                      ? 'bg-app-surface text-app-primary-strong shadow-sm font-bold'
                      : 'text-app-muted hover:text-app-text'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <time className="font-mono text-app-muted">
              {formatTimeOnly(message.createdAt, i18n.resolvedLanguage)}
            </time>
          </div>
        </div>

        {/* Message Body */}
        {isEditing ? (
          <div className="my-2 space-y-2">
            <textarea
              dir={isRtl ? 'rtl' : 'ltr'}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-control border border-app-border-strong bg-app-surface text-app-text text-base"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 text-xs text-app-muted hover:text-app-text"
              >
                {t('proposal.cancel', 'Annuler')}
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1 text-xs font-semibold bg-app-primary-strong text-white rounded-control shadow-1"
              >
                {t('proposal.save', 'Enregistrer')}
              </button>
            </div>
          </div>
        ) : (
          <p
            dir={isRtl ? 'rtl' : 'ltr'}
            className="text-lg font-medium text-app-text leading-relaxed select-text my-1"
          >
            {textContent}
          </p>
        )}

        {/* Confidence or Sequence Strip sub-row */}
        <div className="mt-2 pt-2 border-t border-app-border/40 flex flex-wrap items-center justify-between gap-2">
          {isSign && message.level && (
            <ConfidenceIndicator level={message.level} value={message.confidence ?? undefined} />
          )}

          {!isSign && message.gloss && message.gloss.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-app-muted">LSA:</span>
              <SignSequenceStrip glosses={message.gloss} />
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-1 ms-auto">
            {/* Audio Button */}
            <AudioButton text={textContent} lang={displayLang} size="sm" />

            {/* Replay Signs */}
            {message.gloss && message.gloss.length > 0 && (
              <IconButton
                aria-label={t('timeline.replaySigns', 'Rejouer les signes')}
                tooltip={t('timeline.replaySigns', 'Rejouer les signes')}
                size="sm"
                onClick={() => onReplaySigns?.(message.gloss)}
              >
                <Video className="w-4 h-4 text-app-primary-strong" />
              </IconButton>
            )}

            {/* Copy */}
            <IconButton
              aria-label={copied ? 'Copié' : t('timeline.copy', 'Copier')}
              tooltip={copied ? 'Copié !' : t('timeline.copy', 'Copier')}
              size="sm"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4 text-app-success" /> : <Copy className="w-4 h-4" />}
            </IconButton>

            {/* Edit */}
            {onEditMessage && (
              <IconButton
                aria-label={t('timeline.edit', 'Modifier')}
                tooltip={t('timeline.edit', 'Modifier')}
                size="sm"
                onClick={() => {
                  setEditText(textContent);
                  setIsEditing(true);
                }}
              >
                <Edit2 className="w-4 h-4 text-app-muted" />
              </IconButton>
            )}

            {/* Interpretation Details Disclosure */}
            {isSign && (
              <IconButton
                aria-label={t('timeline.details', "Détails de l'interprétation")}
                tooltip={t('timeline.details', "Détails de l'interprétation")}
                size="sm"
                onClick={() => setShowInterpretation(!showInterpretation)}
              >
                <Info className="w-4 h-4 text-app-muted" />
              </IconButton>
            )}
          </div>
        </div>

        {/* Interpretation Details Dropdown Panel */}
        {showInterpretation && (
          <div className="mt-3 p-3 bg-app-surface-2 rounded-control border border-app-border text-xs text-app-muted space-y-1.5 animate-fade-in">
            <p className="font-semibold text-app-text mb-1">
              {t('interpretation.title', "Détails de l'interprétation IA")}
            </p>
            <div className="flex justify-between">
              <span>{t('interpretation.signs', 'Signes reconnus :')}</span>
              <span className="font-mono font-bold text-app-text">
                {message.gloss.join(' · ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('interpretation.frames', 'Images analysées :')}</span>
              <span className="font-mono text-app-text">
                {message.interpretation?.frames || 36}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('interpretation.latency', 'Délai de traitement :')}</span>
              <span className="font-mono text-app-text">
                {message.interpretation?.latencyMs || 280} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('interpretation.model', 'Modèle :')}</span>
              <span className="text-app-text">
                {message.interpretation?.model || 'LSA-Sequence-TCN-Lite'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
