import React, { useState } from 'react';
import { useUiStore } from '@/stores/uiStore';
import { WifiOff, X } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useUiStore();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <div
      role="status"
      className="bg-amber-50 dark:bg-amber-950/40 border-b border-app-warning/30 px-4 py-2 flex items-center justify-between text-xs text-app-warning font-medium"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>
          Vous êtes hors ligne. La reconnaissance locale, le dictionnaire et les conversations
          enregistrées continuent de fonctionner.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Masquer la bannière hors ligne"
        className="p-1 hover:opacity-80 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
