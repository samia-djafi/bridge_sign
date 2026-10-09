import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { SignClip, UiLang } from '@/types/domain';
import { SignSequenceStrip } from './SignSequenceStrip';
import { SUPPORTED_SIGNS } from '@/data/vocabulary.config';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';

export interface SignPlayerProps {
  clips: SignClip[];
  onFinishSequence?: () => void;
  className?: string;
}

const SIGN_MAP = new Map(SUPPORTED_SIGNS.map((s) => [s.gloss, s]));

export const SignPlayer: React.FC<SignPlayerProps> = ({
  clips,
  onFinishSequence,
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettingsStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const activeClip = clips[currentIndex];
  const activeSign = activeClip ? SIGN_MAP.get(activeClip.gloss) : null;
  const currentLang = (i18n.resolvedLanguage || 'fr') as UiLang;

  // Playback timer loop for canvas simulation if video is placeholder or absent
  useEffect(() => {
    if (!isPlaying || !activeClip) return;

    const duration = (activeClip.durationMs || 1500) / speed;
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);

      // Render simulated hands motion on canvas
      drawCanvas(pct, activeClip.gloss);

      if (elapsed < duration) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        // Move to next clip
        if (currentIndex < clips.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          onFinishSequence?.();
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentIndex, activeClip, speed]);

  const drawCanvas = (pct: number, gloss: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Dark sleek backdrop
    ctx.fillStyle = '#171C1F';
    ctx.fillRect(0, 0, w, h);

    // Silhouette torso guide
    ctx.strokeStyle = '#2B3338';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.35, 36, 0, Math.PI * 2); // Head
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w / 2 - 70, h * 0.65); // Shoulders
    ctx.lineTo(w / 2 + 70, h * 0.65);
    ctx.stroke();

    // Animated hands simulating signing gesture
    const angle = (pct / 100) * Math.PI * 2;
    const leftHandX = w / 2 - 50 + Math.sin(angle) * 35;
    const leftHandY = h * 0.6 + Math.cos(angle) * 25;

    const rightHandX = w / 2 + 50 - Math.sin(angle) * 35;
    const rightHandY = h * 0.58 + Math.cos(angle) * 30;

    // Connect arms
    ctx.strokeStyle = '#0F766E';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 70, h * 0.65);
    ctx.lineTo(leftHandX, leftHandY);
    ctx.moveTo(w / 2 + 70, h * 0.65);
    ctx.lineTo(rightHandX, rightHandY);
    ctx.stroke();

    // Hands circles
    ctx.fillStyle = '#2DD4BF';
    ctx.beginPath();
    ctx.arc(leftHandX, leftHandY, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(rightHandX, rightHandY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Center gloss watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(gloss, w / 2, h * 0.22);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  if (clips.length === 0) {
    return (
      <div className={`p-8 rounded-card bg-app-surface-2 border border-app-border text-center text-app-muted ${className}`}>
        {t('player.clipUnavailable', 'Aucun clip disponible.')}
      </div>
    );
  }

  const glosses = clips.map((c) => c.gloss);

  return (
    <div className={`flex flex-col gap-3 rounded-card bg-app-surface border border-app-border p-4 shadow-1 ${className}`}>
      {/* 16:9 Video Canvas Player */}
      <div className="relative aspect-video w-full rounded-control bg-neutral-900 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-cover"
        />

        {/* Top Badges */}
        <div className="absolute top-3 start-3 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-pill bg-black/60 text-white/90 text-[11px] font-medium backdrop-blur-sm">
            {t('player.placeholderClips', 'Clips de démonstration LSA')}
          </span>
          <span className="px-2 py-0.5 rounded-pill bg-app-primary-strong/80 text-white text-[11px] font-mono">
            {currentIndex + 1} / {clips.length}
          </span>
        </div>

        {/* Captions Overlay at bottom */}
        {settings.captions && activeClip && (
          <div className="absolute bottom-3 inset-x-4 flex justify-center pointer-events-none">
            <div className="px-4 py-1.5 rounded-pill bg-black/75 text-white text-sm font-semibold text-center backdrop-blur-sm border border-white/10 shadow-lg">
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

      {/* Scrubber & Sequence Strip */}
      <SignSequenceStrip
        glosses={glosses}
        currentIndex={currentIndex}
        onSelectSign={(idx) => {
          setCurrentIndex(idx);
        }}
      />

      {/* Controls Row */}
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

        {/* Speed Segmented Control */}
        <div className="flex items-center gap-1 bg-app-surface-2 p-1 rounded-control border border-app-border text-xs font-semibold">
          {[0.5, 1.0, 1.5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded-control transition-all ${
                speed === s
                  ? 'bg-app-surface text-app-primary-strong shadow-1'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
