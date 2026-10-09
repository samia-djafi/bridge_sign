import React from 'react';
import { useUiStore } from '@/stores/uiStore';
import { X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 start-1/2 -translate-x-1/2 md:start-auto md:translate-x-0 md:end-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 md:px-0 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isAlert = toast.type === 'alert';
        return (
          <div
            key={toast.id}
            role={isAlert ? 'alert' : 'status'}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-card bg-app-surface border border-app-border-strong text-app-text shadow-3 text-sm animate-slide-up"
          >
            <span className="flex-1 font-medium">{toast.message}</span>

            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  removeToast(toast.id);
                }}
                className="font-bold text-app-primary-strong hover:underline text-xs uppercase px-2 py-1 rounded-control bg-app-primary-soft shrink-0"
              >
                {toast.action.label}
              </button>
            )}

            <button
              type="button"
              aria-label="Fermer la notification"
              onClick={() => removeToast(toast.id)}
              className="text-app-muted hover:text-app-text p-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
