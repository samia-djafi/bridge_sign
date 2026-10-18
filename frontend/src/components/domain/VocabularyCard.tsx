import React from 'react';
import { VocabularyItem, UiLang } from '@/types/domain';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AudioButton } from './AudioButton';

export interface VocabularyCardProps {
  item: VocabularyItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  item,
  isFavorite = false,
  onToggleFavorite,
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || 'en') as UiLang;

  const mainText = item.text[currentLang] || item.text.en;
  const isRtl = currentLang === 'ar';

  const otherLangs = (['en', 'fr', 'ar'] as const).filter((l) => l !== currentLang);

  return (
    <div
      className={`p-4 rounded-card bg-app-surface border border-app-border shadow-1 flex flex-col justify-between gap-3 text-start transition-all hover:border-app-border-strong ${className}`}
    >
      {/* Top Header: Category Badge & Favorite Button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-pill bg-app-surface-2 border border-app-border text-app-muted">
          {t(`phrasebook.vocabCategory.${item.category}`, item.category)}
        </span>

        {onToggleFavorite && (
          <button
            type="button"
            aria-label={isFavorite ? t('phrasebook.removeFavorite', 'Remove favorite') : t('phrasebook.addFavorite', 'Add to favorites')}
            onClick={() => onToggleFavorite(item.id)}
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

      {/* Main Word Display */}
      <div>
        <h3
          dir={isRtl ? 'rtl' : 'ltr'}
          className="text-lg font-extrabold text-app-text leading-tight"
        >
          {mainText}
        </h3>

        {/* Alternate translations */}
        <div className="mt-1.5 space-y-0.5 text-xs text-app-muted">
          {otherLangs.map((lang) => (
            <p key={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className="truncate">
              <span className="font-semibold uppercase text-[10px] text-app-muted/70 me-1">
                {lang}:
              </span>
              {item.text[lang]}
            </p>
          ))}
        </div>

        {/* Optional Gloss Tag */}
        {item.gloss && (
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 bg-app-surface-2 border border-app-border rounded-pill text-[10px] font-mono text-app-muted font-semibold uppercase">
              {item.gloss}
            </span>
          </div>
        )}
      </div>

      {/* Action Row: Audio Playback */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-app-border/60">
        <div className="flex items-center gap-1.5">
          <AudioButton text={mainText} lang={currentLang} size="sm" />
          <span className="text-xs text-app-muted font-medium">
            {t('timeline.playAudio', 'Écouter la prononciation')}
          </span>
        </div>
      </div>
    </div>
  );
};
