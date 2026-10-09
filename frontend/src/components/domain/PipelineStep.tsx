import React from 'react';
import { Check, Loader, AlertCircle } from 'lucide-react';

export type PipelineState = 'idle' | 'active' | 'done' | 'error';

export interface PipelineStepProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  state: PipelineState;
  className?: string;
}

export const PipelineStep: React.FC<PipelineStepProps> = ({
  stepNumber,
  icon,
  title,
  description,
  state,
  className = '',
}) => {
  const stateStyles = {
    idle: 'bg-app-surface border-app-border text-app-muted',
    active: 'bg-app-primary-soft border-app-primary-strong text-app-primary-strong ring-2 ring-app-primary/30 animate-pulse',
    done: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300',
    error: 'bg-red-50 dark:bg-red-950/40 border-app-error text-app-error',
  }[state];

  return (
    <div
      className={`p-3.5 rounded-card border transition-all flex flex-col gap-2 ${stateStyles} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold font-mono">
            {stepNumber}
          </span>
          <div className="shrink-0">{icon}</div>
        </div>

        <div>
          {state === 'done' && <Check className="w-4 h-4 text-emerald-600" />}
          {state === 'active' && <Loader className="w-4 h-4 text-app-primary-strong animate-spin" />}
          {state === 'error' && <AlertCircle className="w-4 h-4 text-app-error" />}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-app-text">{title}</h4>
        <p className="text-[11px] text-app-muted leading-tight mt-0.5">{description}</p>
      </div>
    </div>
  );
};
