import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      const focusable = sheetRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-xl',
    xl: 'md:max-w-2xl',
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-app-overlay backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={sheetRef}
        className={`w-full ${maxWidthStyles} bg-app-surface border-t md:border border-app-border rounded-t-2xl md:rounded-modal shadow-3 max-h-[90dvh] flex flex-col overflow-hidden animate-slide-up`}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-app-border-strong rounded-full mx-auto my-2.5 md:hidden" />

        {(title || subtitle) && (
          <div className="flex items-start justify-between px-6 py-3.5 border-b border-app-border shrink-0">
            <div>
              {title && <h2 className="text-lg font-semibold text-app-text">{title}</h2>}
              {subtitle && <p className="text-xs text-app-muted mt-0.5">{subtitle}</p>}
            </div>
            <IconButton aria-label="Fermer" size="sm" onClick={onClose}>
              <X className="w-5 h-5 text-app-muted" />
            </IconButton>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-app-surface-2 border-t border-app-border shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
