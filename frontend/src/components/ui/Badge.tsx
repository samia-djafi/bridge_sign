import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'demo' | 'live' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  const variantStyles = {
    neutral: 'bg-app-surface-2 text-app-muted border border-app-border',
    demo: 'bg-app-primary-soft-2 text-app-primary-strong border border-app-primary-strong/30 font-medium',
    live: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium',
    success: 'bg-green-50 text-app-success border border-green-200',
    warning: 'bg-amber-50 text-app-warning border border-amber-200',
    error: 'bg-red-50 text-app-error border border-red-200',
    info: 'bg-cyan-50 text-app-info border border-cyan-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-pill tracking-normal ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
