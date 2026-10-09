import React from 'react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  badge?: 'demo' | 'live';
  subtext?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  badge,
  subtext,
  className = '',
}) => {
  return (
    <div
      className={`p-4 rounded-card bg-app-surface border border-app-border shadow-1 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">
          {label}
        </span>
        {badge && (
          <span
            className={`px-1.5 py-0.5 rounded-pill text-[10px] font-bold uppercase ${
              badge === 'demo'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            {badge === 'demo' ? 'Démo' : 'Direct'}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="text-2xl font-black text-app-text tabular-nums">{value}</span>
        {unit && <span className="text-xs text-app-muted font-medium">{unit}</span>}
      </div>

      {subtext && <p className="text-xs text-app-muted mt-1">{subtext}</p>}
    </div>
  );
};
