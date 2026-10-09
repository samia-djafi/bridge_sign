import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-card border border-dashed border-app-border bg-app-surface/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-app-surface-2 flex items-center justify-center text-app-muted mb-3.5">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-app-text mb-1">{title}</h3>
      <p className="text-sm text-app-muted max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
