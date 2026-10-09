import React from 'react';
import { Phrase, UiLang } from '@/types/domain';
import { Star, Play, Siren, Send } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { useTranslation } from 'react-i18next';
import { AudioButton } from './AudioButton';

export interface PhraseCardProps {
  phrase: Phrase;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSendToConversation?: (phrase: Phrase) => void;
  onPlayInLsa?: (phrase: Phrase) => void;
  className?: string;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  isFavorite = false,
  onToggleFavorite,
  onSendToConversation,
  onPlayInLsa,
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || 'fr') as UiLang;

  const mainText = phrase.text[currentLang] || phrase.text.fr;
  const isRtl = currentLang === 'ar';

  const otherLangs = (['fr', 'ar', 'en'] as const).filter((l) => l !== currentLang);

  return (
    <div
      className={`p-4 rounded-card bg-app-surface border ${
        phrase.emergency
          ? 'border-app-warning/50 shadow-1 bg-amber-50/20'
          : 'border-app-border shadow-1'
      } flex flex-col justify-between gap-3 text-start transition-all hover:border-app-border-strong ${className}`}
    >
      {/* Top Header: Category / Emergency Badge & Favorite Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {phrase.emergency ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold">
              <Siren className="w-3 h-3 text-app-warning" />
              <span>{t('emergency.button', 'Urgence')}</span>
            </span>
          ) : (
            <span className="text-xs uppercase font-semibold text-app-muted tracking-wider">
              {phrase.category}
            </span>
          )}
        </div>

        {onToggleFavorite && (
          <button
            type="button"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={() => onToggleFavorite(phrase.id)}
            className={`p-1 rounded-control transition-colors ${
              isFavorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Main Phrase Text */}
      <div>
        <p
          dir={isRtl ? 'rtl' : 'ltr'}
          className="text-base font-bold text-app-text leading-snug"
        >
          {mainText}
        </p>

        {/* Alternate translations */}
        <div className="mt-1 space-y-0.5 text-xs text-app-muted">
          {otherLangs.map((lang) => (
            <p key={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className="truncate">
              {phrase.text[lang]}
            </p>
          ))}
        </div>

        {/* Gloss Chips */}
        <div className="mt-2 flex flex-wrap gap-1">
          {phrase.gloss.map((g, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-app-surface-2 border border-app-border rounded-pill text-[11px] font-mono text-app-muted font-semibold uppercase"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-app-border/60">
        <div className="flex items-center gap-1">
          {/* TTS Audio */}
          <AudioButton text={mainText} lang={currentLang} size="sm" />

          {/* Play in LSA */}
          {onPlayInLsa && (
            <IconButton
              aria-label={t('phrasebook.playAction', 'Voir en LSA')}
              tooltip={t('phrasebook.playAction', 'Voir en LSA')}
              size="sm"
              onClick={() => onPlayInLsa(phrase)}
            >
              <Play className="w-4 h-4 fill-current text-app-primary-strong" />
            </IconButton>
          )}
        </div>

        {/* Send to conversation */}
        {onSendToConversation && (
          <button
            type="button"
            onClick={() => onSendToConversation(phrase)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-app-primary-soft text-app-primary-strong hover:bg-app-primary-soft-2 font-semibold text-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('phrasebook.sendAction', 'Envoyer')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
