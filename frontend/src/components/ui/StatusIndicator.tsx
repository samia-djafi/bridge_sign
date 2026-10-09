import React from 'react';
import { AlertCircle } from 'lucide-react';

export type StatusType = 'ready' | 'active' | 'warning' | 'error' | 'off';

export interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  ariaLive?: boolean;
  className?: string;
  asButton?: boolean;
  onClick?: () => void;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  ariaLive = false,
  className = '',
  asButton = false,
  onClick,
}) => {
  const dotStyles = {
    ready: 'bg-app-primary-strong',
    active: 'bg-app-primary-strong animate-pulse ring-2 ring-app-primary/30',
    warning: 'bg-app-warning',
    error: 'bg-app-error',
    off: 'bg-transparent border-2 border-app-muted',
  }[status];

  const content = (
    <>
      {status === 'error' ? (
        <AlertCircle className="w-3.5 h-3.5 text-app-error shrink-0" aria-hidden="true" />
      ) : (
        <span
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotStyles}`}
          aria-hidden="true"
        />
      )}
      <span className="text-xs font-medium text-app-text whitespace-nowrap">{label}</span>
    </>
  );

  if (asButton) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-live={ariaLive ? 'polite' : undefined}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-app-surface border border-app-border hover:bg-app-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong text-start ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      aria-live={ariaLive ? 'polite' : undefined}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      {content}
    </div>
  );
};
