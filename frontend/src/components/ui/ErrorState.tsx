import React, { useState } from 'react';
import { AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  code?: string;
  title: string;
  description: string;
  onRetry?: () => void;
  secondaryAction?: React.ReactNode;
  details?: Record<string, unknown> | string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  code,
  title,
  description,
  onRetry,
  secondaryAction,
  details,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-6 rounded-card border border-app-error/20 bg-app-surface text-app-text shadow-1 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-50 text-app-error flex items-center justify-center mb-3">
        <AlertOctagon className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-app-text mb-1">{title}</h3>
      <p className="text-sm text-app-muted max-w-md mb-4">{description}</p>

      {(onRetry || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
          {onRetry && (
            <Button variant="primary" size="md" onClick={onRetry}>
              Réessayer / Retry
            </Button>
          )}
          {secondaryAction}
        </div>
      )}

      {code && (
        <div className="mt-2 text-xs">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1 text-app-muted hover:text-app-text font-mono underline"
          >
            <span>Code : {code}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && details && (
            <pre className="mt-2 p-2 bg-app-surface-2 rounded-control text-xs text-start font-mono overflow-auto max-w-sm max-h-32">
              {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
