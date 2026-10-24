import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, VideoOff } from 'lucide-react';
import { SignClip, UiLang } from '@/types/domain';
import { SignSequenceStrip } from './SignSequenceStrip';
import { SUPPORTED_SIGNS } from '@/data/vocabulary.config';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';

export interface SignPlayerProps {
  clips: SignClip[];
  onFinishSequence?: () => void;
  className?: string;
  autoPlay?: boolean;
}

const SIGN_MAP = new Map(SUPPORTED_SIGNS.map((s) => [s.gloss, s]));

export const SignPlayer: React.FC<SignPlayerProps> = ({
  clips,
  onFinishSequence,
  className = '',
  autoPlay = true,
}) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettingsStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const activeClip = clips[currentIndex];
  const activeSign = activeClip ? SIGN_MAP.get(activeClip.gloss) : null;
  const currentLang = (i18n.resolvedLanguage || 'fr') as UiLang;

  // Whenever clip changes, reset states
  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);
    setIsPlaying(false);
  }, [currentIndex, activeClip?.src]);

  // Video element playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed]);

  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
    setVideoError(false);
    if (autoPlay && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleVideoError = () => {
    setVideoLoaded(false);
    setVideoError(true);
    setIsPlaying(false);
  };

  const handleVideoEnded = () => {
    if (currentIndex < clips.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      onFinishSequence?.();
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current || !videoLoaded) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleRestart = () => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handlePrevSign = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextSign = () => {
    if (currentIndex < clips.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (clips.length === 0) {
    return (
      <div className={`p-8 rounded-card bg-app-surface-2 border border-app-border text-center text-app-muted ${className}`}>
        {t('player.clipUnavailable', 'Aucun clip disponible.')}
      </div>
    );
  }

  const glosses = clips.map((c) => c.gloss);
  const isVideoAvailable = videoLoaded && !videoError && !activeClip?.isPlaceholder;

  return (
    <div
      role="region"
      aria-label={t('textToSign.title', 'Text to Sign (LSA)')}
      className={`flex flex-col gap-3 rounded-card bg-app-surface border border-app-border p-4 shadow-1 ${className}`}
    >
      {/* 16:9 Dedicated Sign Display Box */}
      <div className="relative aspect-video w-full rounded-control bg-neutral-900 border border-app-border-strong overflow-hidden flex items-center justify-center select-none">
        {/* Real Video Element (when video source exists) */}
        {activeClip && !activeClip.isPlaceholder && (
          <video
            ref={videoRef}
            src={activeClip.src}
            playsInline
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
            onEnded={handleVideoEnded}
            className={`w-full h-full object-contain ${videoLoaded && !videoError ? 'block' : 'hidden'}`}
          />
        )}

        {/* Missing / Pending Real Asset Honest Display (No fake gesture animation) */}
        {(!isVideoAvailable || activeClip?.isPlaceholder) && (
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-3 bg-gradient-to-b from-[#112630] to-[#0a171e] text-white">
            <div className="w-12 h-12 rounded-full bg-app-primary-strong/20 border border-app-primary-strong/40 flex items-center justify-center text-app-primary-strong">
              <VideoOff className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-md">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-pill bg-app-primary-strong/20 border border-app-primary-strong/40 text-app-primary-soft-2 text-xs font-mono font-bold tracking-wider uppercase">
                {activeClip?.gloss || ''}
              </div>

              {activeSign && (
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {activeSign.labels[currentLang] || activeSign.labels.fr}
                </h4>
              )}

              <p className="text-xs text-app-muted leading-relaxed max-w-sm mx-auto">
                {t(
                  'textToSign.missingAssetMessage',
                  'Linguistic mapping to LSA is verified. Studio recordings with the Algerian Deaf community are currently in production. No synthetic gesture is generated.'
                )}
              </p>
            </div>

            <span className="text-[11px] font-mono text-white/50 bg-black/40 px-2 py-0.5 rounded border border-white/10">
              {t('textToSign.assetIntegrationPath', { path: `/signs/${activeClip?.gloss || ''}.webm` })}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 start-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-pill bg-black/70 text-white/95 text-[11px] font-medium backdrop-blur-sm border border-white/10">
            {isVideoAvailable
              ? t('player.verifiedVideo', 'Vidéo LSA authentique')
              : t('textToSign.missingAssetBadge', 'Enregistrement studio en attente')}
          </span>
          {clips.length > 1 && (
            <span className="px-2 py-0.5 rounded-pill bg-app-primary-strong/90 text-white text-[11px] font-mono font-bold">
              {currentIndex + 1} / {clips.length}
            </span>
          )}
        </div>

        {/* Captions Overlay at bottom */}
        {settings.captions && activeClip && isVideoAvailable && (
          <div className="absolute bottom-3 inset-x-4 flex justify-center pointer-events-none">
            <div className="px-4 py-1.5 rounded-pill bg-black/80 text-white text-sm font-semibold text-center backdrop-blur-sm border border-white/10 shadow-lg">
              <span className="uppercase text-app-primary-soft-2 font-mono me-2">
                {activeClip.gloss}
              </span>
              {activeSign && (
                <span className="text-white/95">
                  ({activeSign.labels[currentLang] || activeSign.labels.fr})
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Multi-Sign Sequence Navigation & Sequence Strip */}
      {clips.length > 1 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-app-muted font-medium px-1">
            <span>
              {t('textToSign.signSegmentIndicator', {
                current: currentIndex + 1,
                total: clips.length,
              })}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevSign}
                disabled={currentIndex === 0}
                aria-label={t('textToSign.prevSign', 'Signe précédent')}
                className="px-2 py-1 rounded bg-app-surface-2 border border-app-border text-xs font-semibold text-app-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-app-border flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5 rtl:-scale-x-100" />
                <span className="hidden sm:inline">{t('textToSign.prevSign', 'Précédent')}</span>
              </button>
              <button
                type="button"
                onClick={handleNextSign}
                disabled={currentIndex === clips.length - 1}
                aria-label={t('textToSign.nextSign', 'Signe suivant')}
                className="px-2 py-1 rounded bg-app-surface-2 border border-app-border text-xs font-semibold text-app-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-app-border flex items-center gap-1"
              >
                <span className="hidden sm:inline">{t('textToSign.nextSign', 'Suivant')}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
              </button>
            </div>
          </div>

          <SignSequenceStrip
            glosses={glosses}
            currentIndex={currentIndex}
            onSelectSign={(idx) => setCurrentIndex(idx)}
          />
        </div>
      )}

      {/* Video Playback Controls — Rendered ONLY if the asset actually supports animation / video */}
      {isVideoAvailable && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-app-border">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? t('player.pause', 'Pause') : t('player.play', 'Lecture')}
              className="w-10 h-10 rounded-control bg-app-primary-strong text-white hover:bg-app-primary-hover flex items-center justify-center shadow-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              aria-label={t('player.restart', 'Recommencer')}
              className="w-10 h-10 rounded-control bg-app-surface border border-app-border-strong text-app-text hover:bg-app-surface-2 flex items-center justify-center shadow-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-app-surface-2 p-1 rounded-control border border-app-border text-xs font-semibold">
            {[0.5, 1.0, 1.5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-control transition-all ${
                  speed === s
                    ? 'bg-app-surface text-app-primary-strong shadow-1 font-bold'
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
