import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSettingsStore } from '@/stores/settingsStore';

export const RequireOnboarding: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettingsStore();
  const location = useLocation();

  if (!settings.onboarded && location.pathname !== '/app/onboarding') {
    return <Navigate to="/app/onboarding" replace />;
  }

  return <>{children}</>;
};

export const PublicEntryRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettingsStore();

  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone);

  if (settings.onboarded || isStandalone) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};
