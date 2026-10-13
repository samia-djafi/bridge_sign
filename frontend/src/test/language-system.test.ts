import { describe, it, expect, beforeEach } from 'vitest';
import i18n from '@/i18n';
import { useSettingsStore } from '@/stores/settingsStore';

describe('Language System Requirements', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults the application language to English on clean visit', () => {
    // With no localStorage keys, i18n should be configured to 'en'
    expect(i18n.resolvedLanguage || i18n.language).toBe('en');
  });

  it('has DEFAULT_SETTINGS configured with English uiLang and defaultSpokenLang', () => {
    const { settings } = useSettingsStore.getState();
    expect(settings.uiLang).toBe('en');
    expect(settings.defaultSpokenLang).toBe('en');
  });

  it('preserves an explicit user language choice in localStorage', () => {
    const { setUiLanguage } = useSettingsStore.getState();
    setUiLanguage('fr');

    expect(useSettingsStore.getState().settings.uiLang).toBe('fr');
    expect(i18n.language).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
    expect(document.documentElement.dir).toBe('ltr');

    // Switch to Arabic
    setUiLanguage('ar');
    expect(useSettingsStore.getState().settings.uiLang).toBe('ar');
    expect(i18n.language).toBe('ar');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');

    // Reset back to English
    setUiLanguage('en');
    expect(useSettingsStore.getState().settings.uiLang).toBe('en');
    expect(i18n.language).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
