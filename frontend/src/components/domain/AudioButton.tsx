import React, { useState } from 'react';
import { Volume2, Square, Loader } from 'lucide-react';
import { registry } from '@/services/registry';
import { SpokenLang } from '@/types/domain';
import { useTranslation } from 'react-i18next';

export interface AudioButtonProps {
  text: string;
  lang: SpokenLang;
  size?: 'sm' | 'md';
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  lang,
  size = 'md',
  className = '',
}) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const speech = registry.speech;
  const isSupported = speech.tts.isSupported();
  const voices = speech.voicesFor(lang);
  const hasVoice = isSupported && (voices.length > 0 || typeof window !== 'undefined');

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!hasVoice) return;

    if (isPlaying) {
      speech.tts.stop();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      setIsPlaying(true);
      setIsLoading(false);
      await speech.tts.speak({
        text,
        lang,
      });
    } finally {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const sizeStyles = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={!hasVoice || !text}
      aria-label={
        isPlaying
          ? t('player.pause', 'Arrêter la lecture audio')
          : t('timeline.playAudio', 'Écouter la prononciation')
      }
      title={
        !hasVoice
          ? t('err.ttsUnavailable', 'Aucune voix disponible pour cette langue')
          : undefined
      }
      className={`inline-flex items-center justify-center rounded-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong disabled:opacity-40 disabled:cursor-not-allowed ${
        isPlaying
          ? 'bg-app-primary-strong text-white'
          : 'bg-app-surface text-app-text border border-app-border-strong hover:bg-app-surface-2'
      } ${sizeStyles} ${className}`}
    >
      {isLoading ? (
        <Loader className="w-4 h-4 animate-spin text-current" />
      ) : isPlaying ? (
        <Square className="w-4 h-4 fill-current" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
};
