import React, { useState } from 'react';
import { Check, Minus, AlertTriangle, X } from 'lucide-react';
import { ConfidenceLevel } from '@/types/domain';

export interface DetectedSignChipProps {
  gloss: string;
  confidence?: number;
  level?: ConfidenceLevel;
  atMs?: number;
  onRemove?: () => void;
  className?: string;
}

export const DetectedSignChip: React.FC<DetectedSignChipProps> = ({
  gloss,
  confidence = 0.9,
  level = 'high',
  atMs = 0,
  onRemove,
  className = '',
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const formatAtMs = (ms: number) => {
    const totalSec = ms / 1000;
    const m = Math.floor(totalSec / 60);
    const s = (totalSec % 60).toFixed(1);
    return `${m.toString().padStart(2, '0')}:${s.padStart(4, '0')}`;
  };

  const isLow = level === 'low';

  const glyph = {
    high: <Check className="w-3 h-3 text-app-primary-strong" aria-hidden="true" />,
    medium: <Minus className="w-3 h-3 text-app-warning" aria-hidden="true" />,
    low: <AlertTriangle className="w-3 h-3 text-app-error" aria-hidden="true" />,
  }[level];

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-semibold uppercase tracking-wider transition-all select-none ${
          isLow
            ? 'bg-amber-50 text-app-text border border-dashed border-app-warning shadow-sm'
            : 'bg-app-primary-soft-2 text-app-text border border-app-primary-strong/20 shadow-1'
        } hover:border-app-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong`}
      >
        <span>{glyph}</span>
        <span>{gloss}</span>

        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            aria-label={`Supprimer le signe ${gloss}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                onRemove();
              }
            }}
            className="ms-1 p-0.5 rounded-full hover:bg-black/10 text-app-muted hover:text-app-text transition-colors"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {/* Detail Popover */}
      {showPopover && (
        <div className="absolute z-40 top-full mt-1.5 start-0 p-2.5 bg-app-surface border border-app-border-strong rounded-card shadow-2 text-xs min-w-[160px] animate-fade-in text-start">
          <div className="flex justify-between items-center mb-1 text-app-muted">
            <span>Horodatage :</span>
            <span className="font-mono text-app-text">{formatAtMs(atMs)}</span>
          </div>
          <div className="flex justify-between items-center mb-2 text-app-muted">
            <span>Confiance :</span>
            <span className="font-semibold text-app-text">
              {Math.round(confidence * 100)}% ({level})
            </span>
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={() => {
                setShowPopover(false);
                onRemove();
              }}
              className="w-full text-start text-app-error hover:underline font-medium pt-1 border-t border-app-border"
            >
              Supprimer le signe
            </button>
          )}
        </div>
      )}
    </div>
  );
};
