import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-xs font-medium text-app-muted mb-1">
          <span>{label}</span>
          <span className="font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        className="w-full h-2 rounded-full bg-app-surface-2 border border-app-border overflow-hidden"
      >
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-app-primary-strong transition-all duration-300 rounded-full"
        />
      </div>
    </div>
  );
};
