import React from 'react';
import { Check } from 'lucide-react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  p?: 16 | 20 | 24;
  interactive?: boolean;
  selected?: boolean;
  asButton?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      p = 20,
      interactive = false,
      selected = false,
      asButton = false,
      disabled = false,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const padStyle = {
      16: 'p-4',
      20: 'p-5',
      24: 'p-6',
    }[p];

    const baseStyles = 'relative rounded-card transition-all duration-150 text-app-text';

    const stateStyles = selected
      ? 'bg-app-primary-soft border-2 border-app-primary-strong shadow-1'
      : 'bg-app-surface border border-app-border';

    const interactiveStyles = interactive
      ? 'cursor-pointer hover:border-app-border-strong hover:shadow-1 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong focus-visible:ring-offset-2'
      : '';

    const disabledStyles = disabled ? 'opacity-50 pointer-events-none' : '';

    if (asButton) {
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className={`${baseStyles} ${padStyle} ${stateStyles} ${interactiveStyles} ${disabledStyles} text-start w-full ${className}`}
          {...(props as any)}
        >
          {selected && (
            <div className="absolute top-3 end-3 w-5 h-5 rounded-full bg-app-primary-strong text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
          {children}
        </button>
      );
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`${baseStyles} ${padStyle} ${stateStyles} ${interactiveStyles} ${disabledStyles} ${className}`}
        {...props}
      >
        {selected && (
          <div className="absolute top-3 end-3 w-5 h-5 rounded-full bg-app-primary-strong text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
