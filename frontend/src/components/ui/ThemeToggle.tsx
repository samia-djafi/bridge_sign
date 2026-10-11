import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { Sun, Moon } from 'lucide-react';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'sm' }) => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();

  // Determine effective theme
  const isDarkEffective = (() => {
    if (settings.theme === 'dark') return true;
    if (settings.theme === 'light') return false;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  })();

  const handleToggle = () => {
    // If currently dark, switch to light. If light, switch to dark.
    const nextTheme = isDarkEffective ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const label = isDarkEffective
    ? t('settings.themeLight', 'Mode clair')
    : t('settings.themeDark', 'Mode sombre');

  const buttonSizeClass = size === 'sm' ? 'w-8 h-8 p-1.5' : 'w-10 h-10 p-2';
  const iconSizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center rounded-control bg-app-surface-2 hover:bg-app-border text-app-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong select-none ${buttonSizeClass} ${className}`}
      aria-label={label}
      title={label}
    >
      {isDarkEffective ? (
        <Sun className={`${iconSizeClass} text-amber-400`} aria-hidden="true" />
      ) : (
        <Moon className={`${iconSizeClass} text-app-muted`} aria-hidden="true" />
      )}
    </button>
  );
};
