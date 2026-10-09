import React from 'react';

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className = '' }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-mono font-medium text-app-text bg-app-surface-2 border border-app-border-strong rounded shadow-sm select-none ${className}`}
    >
      {children}
    </kbd>
  );
};
