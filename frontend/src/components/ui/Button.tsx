import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      iconStart,
      iconEnd,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-control transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'h-9 px-3 text-xs gap-1.5',
      md: 'h-11 px-4 text-sm gap-2 min-h-[44px]',
      lg: 'h-12 px-6 text-base gap-2.5 min-h-[48px]',
    }[size];

    const variantStyles = {
      primary:
        'bg-app-primary-strong text-white hover:bg-app-primary-hover active:bg-app-primary-hover shadow-1 border border-transparent',
      secondary:
        'bg-app-surface text-app-text border border-app-border-strong hover:bg-app-surface-2 hover:border-app-text active:bg-app-surface-2 shadow-1',
      ghost:
        'bg-transparent text-app-text hover:bg-app-surface-2 active:bg-app-border border border-transparent',
      destructive:
        'bg-app-error text-white hover:opacity-90 active:opacity-95 shadow-1 border border-transparent',
    }[variant];

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 me-2 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        ) : (
          iconStart && <span className="inline-flex shrink-0 rtl:-scale-x-100">{iconStart}</span>
        )}
        <span>{children}</span>
        {!loading && iconEnd && (
          <span className="inline-flex shrink-0 rtl:-scale-x-100">{iconEnd}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
