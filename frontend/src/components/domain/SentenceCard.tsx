import React, { useState } from 'react';
import { ConfidenceLevel, SpokenLang, Translation } from '@/types/domain';
import { ConfidenceIndicator } from '@/components/ui/ConfidenceIndicator';
import { Button } from '@/components/ui/Button';
import { Send, Edit3, Trash2, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SentenceCardProps {
  sentence: Translation;
  confidence?: number;
  level?: ConfidenceLevel;
  spokenLang: SpokenLang;
  onSend: (finalSentence: Translation, displayLang: SpokenLang) => void;
  onDiscard: () => void;
  className?: string;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  confidence = 0.92,
  level = 'high',
  spokenLang,
  onSend,
  onDiscard,
  className = '',
}) => {
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState<SpokenLang>(spokenLang);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState<Translation>({ ...sentence });

  const currentText = editedText[activeLang] || '';
  const isRtl = activeLang === 'ar';

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText({ ...sentence });
    setIsEditing(false);
  };

  return (
    <div
      role="region"
      aria-label={t('proposal.title', 'Message proposé')}
      className={`p-5 rounded-card bg-app-surface border-2 border-app-primary-strong/30 shadow-2 flex flex-col gap-4 animate-slide-up ${className}`}
    >
      {/* Top Header: Label, Confidence, Language Switcher Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-app-border pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-app-primary-strong">
            {t('proposal.title', 'Message proposé')}
          </span>
          <ConfidenceIndicator level={level} value={confidence} showValue={false} />
        </div>

        {/* FR | AR | EN switcher chips */}
        <div className="flex items-center gap-1 bg-app-surface-2 p-1 rounded-control text-xs font-semibold">
          {(['fr', 'ar', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-2 py-0.5 rounded-control uppercase transition-all ${
                activeLang === lang
                  ? 'bg-app-surface text-app-primary-strong shadow-1 font-bold'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sentence Body */}
      <div className="py-2">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              dir={isRtl ? 'rtl' : 'ltr'}
              value={currentText}
              onChange={(e) =>
                setEditedText({
                  ...editedText,
                  [activeLang]: e.target.value,
                })
              }
              rows={3}
              className="w-full p-3 rounded-control border border-app-border-strong bg-app-surface-2 text-app-text text-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} iconStart={<X className="w-3.5 h-3.5" />}>
                {t('proposal.cancel', 'Annuler')}
              </Button>
              <Button size="sm" variant="secondary" onClick={handleSaveEdit} iconStart={<Check className="w-3.5 h-3.5" />}>
                {t('proposal.save', 'Enregistrer')}
              </Button>
            </div>
          </div>
        ) : (
          <p
            dir={isRtl ? 'rtl' : 'ltr'}
            className="text-2xl font-bold text-app-text leading-relaxed tracking-normal select-text"
          >
            {currentText}
          </p>
        )}
      </div>

      {/* Actions Row: Send (Primary), Edit (Secondary), Discard (Ghost) */}
      {!isEditing && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-app-border">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              iconStart={<Edit3 className="w-4 h-4" />}
              onClick={() => setIsEditing(true)}
            >
              {t('proposal.edit', 'Modifier')}
            </Button>
            <Button
              variant="ghost"
              size="md"
              iconStart={<Trash2 className="w-4 h-4 text-app-muted" />}
              onClick={onDiscard}
            >
              {t('proposal.discard', 'Ignorer')}
            </Button>
          </div>

          <Button
            variant="primary"
            size="lg"
            iconEnd={<Send className="w-4 h-4" />}
            onClick={() => onSend(editedText, activeLang)}
          >
            {t('proposal.send', 'Envoyer')}
          </Button>
        </div>
      )}
    </div>
  );
};
