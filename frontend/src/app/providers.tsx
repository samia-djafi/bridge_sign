import React, { useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useUiStore } from '@/stores/uiStore';
import { Analytics } from '@vercel/analytics/react';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      useUiStore.getState().setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      useUiStore.getState().setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return (
    <ErrorBoundary>
      {children}
      <Analytics />
    </ErrorBoundary>
  );
};
