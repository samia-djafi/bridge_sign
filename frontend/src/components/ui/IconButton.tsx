import React, { useState } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'ghost' | 'secondary' | 'primary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  flipRtl?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      'aria-label': ariaLabel,
      variant = 'ghost',
      size = 'md',
      tooltip,
      flipRtl = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const sizeStyles = {
      sm: 'w-9 h-9 min-w-[36px] min-h-[36px] text-sm',
      md: 'w-11 h-11 min-w-[44px] min-h-[44px] text-base',
      lg: 'w-12 h-12 min-w-[48px] min-h-[48px] text-lg',
    }[size];

    const variantStyles = {
      ghost: 'bg-transparent text-app-text hover:bg-app-surface-2 active:bg-app-border border border-transparent',
      secondary: 'bg-app-surface text-app-text border border-app-border-strong hover:bg-app-surface-2 active:bg-app-surface-2 shadow-1',
      primary: 'bg-app-primary-strong text-white hover:bg-app-primary-hover active:bg-app-primary-hover shadow-1 border border-transparent',
      destructive: 'bg-app-error text-white hover:opacity-90 active:opacity-95 shadow-1 border border-transparent',
    }[variant];

    return (
      <div className="relative inline-flex items-center justify-center">
        <button
          ref={ref}
          aria-label={ariaLabel}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className={`inline-flex items-center justify-center rounded-control transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeStyles} ${variantStyles} ${flipRtl ? 'rtl:-scale-x-100' : ''} ${className}`}
          {...props}
        >
          {children}
        </button>

        {tooltip && showTooltip && (
          <div
            role="tooltip"
            className="absolute bottom-full mb-1.5 px-2 py-1 bg-app-text text-app-surface text-xs rounded-control whitespace-nowrap shadow-2 pointer-events-none z-50 animate-fade-in"
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  }
);

IconButton.displayName = 'IconButton';
