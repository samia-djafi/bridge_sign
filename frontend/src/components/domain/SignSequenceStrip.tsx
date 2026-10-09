import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface SignSequenceStripProps {
  glosses: string[];
  currentIndex?: number;
  onSelectSign?: (index: number) => void;
  className?: string;
}

export const SignSequenceStrip: React.FC<SignSequenceStripProps> = ({
  glosses,
  currentIndex = -1,
  onSelectSign,
  className = '',
}) => {
  if (glosses.length === 0) return null;

  return (
    <div
      role="list"
      aria-label="Séquence de signes LSA"
      className={`flex items-center gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar ${className}`}
    >
      {glosses.map((gloss, idx) => {
        const isSelected = idx === currentIndex;
        return (
          <React.Fragment key={`${gloss}-${idx}`}>
            <button
              type="button"
              role="listitem"
              onClick={() => onSelectSign?.(idx)}
              className={`px-3 py-1 rounded-pill text-xs font-semibold uppercase tracking-wider shrink-0 transition-all select-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong ${
                isSelected
                  ? 'bg-app-primary-strong text-white border-app-primary-strong shadow-1 scale-105'
                  : 'bg-app-surface text-app-text border-app-border hover:border-app-border-strong hover:bg-app-surface-2'
              }`}
            >
              {gloss}
            </button>

            {idx < glosses.length - 1 && (
              <ArrowRight
                className="w-3.5 h-3.5 text-app-muted shrink-0 rtl:-scale-x-100"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
