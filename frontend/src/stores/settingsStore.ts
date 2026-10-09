import { create } from 'zustand';
import { Settings, UiLang } from '@/types/domain';
import { registry } from '@/services/registry';
import { setAppLanguage } from '@/i18n';

const STORAGE_KEY = 'lsab.settings.v1';

const DEFAULT_SETTINGS: Settings = {
  version: 1,
  onboarded: false,
  role: 'helper',
  uiLang: 'fr',
  defaultSpokenLang: 'fr',
  lastContext: 'healthcare',
  lastMode: 'two_way',
  theme: 'system',
  textScale: 100,
  reducedMotion: 'system',
  captions: true,
  showGloss: true,
  largeTargets: false,
  haptics: true,
  announce: 'full',
  camera: {
    mirror: true,
    resolution: 'auto',
    showTrackingByDefault: false,
  },
  audio: {
    voiceOutput: true,
    rate: 1.0,
    volume: 1.0,
    voices: {},
  },
  ai: {
    adapter: (import.meta.env.VITE_AI_ADAPTER as any) === 'http' ? 'http' : 'mock',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    threshold: Number(import.meta.env.VITE_CONFIDENCE_THRESHOLD || 0.70),
  },
  privacy: {
    retention: 'forever',
    autoLogMessages: true,
  },
};

function applyDomSettings(settings: Settings) {
  if (typeof document === 'undefined') return;

  // Theme
  const root = document.documentElement;
  if (settings.theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', settings.theme);
  }

  // Text Scale
  root.setAttribute('data-text-scale', settings.textScale.toString());

  // Reduced motion
  if (settings.reducedMotion === 'system') {
    root.removeAttribute('data-reduced-motion');
  } else {
    root.setAttribute('data-reduced-motion', settings.reducedMotion);
  }

  // Large targets
  if (settings.largeTargets) {
    root.setAttribute('data-large-targets', 'true');
  } else {
    root.removeAttribute('data-large-targets');
  }
}

function loadInitialSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    if (parsed.version === 1) {
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse stored settings, falling back to defaults', e);
  }
  return DEFAULT_SETTINGS;
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (partial: Partial<Settings> | ((prev: Settings) => Partial<Settings>)) => void;
  setUiLanguage: (lang: UiLang) => void;
  resetSettings: () => void;
}

const initial = loadInitialSettings();
applyDomSettings(initial);
registry.setAiAdapter(initial.ai.adapter, initial.ai.apiBaseUrl);

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: initial,

  updateSettings: (updater) => {
    set((state) => {
      const partial = typeof updater === 'function' ? updater(state.settings) : updater;
      const next = { ...state.settings, ...partial };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save settings', err);
      }

      applyDomSettings(next);

      if (partial.ai) {
        registry.setAiAdapter(next.ai.adapter, next.ai.apiBaseUrl);
      }

      if (partial.uiLang && partial.uiLang !== state.settings.uiLang) {
        setAppLanguage(partial.uiLang);
      }

      return { settings: next };
    });
  },

  setUiLanguage: (lang: UiLang) => {
    setAppLanguage(lang);
    set((state) => {
      const next = { ...state.settings, uiLang: lang };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { settings: next };
    });
  },

  resetSettings: () => {
    localStorage.removeItem(STORAGE_KEY);
    applyDomSettings(DEFAULT_SETTINGS);
    setAppLanguage(DEFAULT_SETTINGS.uiLang);
    set({ settings: DEFAULT_SETTINGS });
  },
}));
