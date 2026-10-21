import { create } from 'zustand';
import { Settings, UiLang } from '@/types/domain';
import { registry } from '@/services/registry';
import { setAppLanguage } from '@/i18n';

const STORAGE_KEY = 'connectsign.settings.v1';
const LEGACY_STORAGE_KEY = 'lsab.settings.v1';

export const PRODUCTION_RENDER_AI_URL = 'https://connect-sign.onrender.com';

const DEFAULT_AI_ADAPTER: 'mock' | 'http' =
  (import.meta.env.VITE_AI_ADAPTER as any) === 'mock' ? 'mock' : 'http';
const DEFAULT_API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || PRODUCTION_RENDER_AI_URL;

const DEFAULT_SETTINGS: Settings = {
  version: 1,
  onboarded: false,
  role: 'helper',
  uiLang: 'en',
  defaultSpokenLang: 'en',
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
    adapter: DEFAULT_AI_ADAPTER,
    apiBaseUrl: DEFAULT_API_BASE_URL,
    threshold: Number(import.meta.env.VITE_CONFIDENCE_THRESHOLD || 0.70),
  },
  privacy: {
    retention: 'forever',
    autoLogMessages: true,
  },
};

let systemThemeMediaQuery: MediaQueryList | null = null;
let systemThemeListener: ((e: MediaQueryListEvent) => void) | null = null;

function applyDomSettings(settings: Settings) {
  if (typeof document === 'undefined') return;

  // Theme
  const root = document.documentElement;
  if (settings.theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (!systemThemeMediaQuery) {
        systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        systemThemeListener = (e: MediaQueryListEvent) => {
          const currentTheme = useSettingsStore?.getState?.()?.settings?.theme;
          if (currentTheme === 'system') {
            root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          }
        };
        systemThemeMediaQuery.addEventListener('change', systemThemeListener);
      }
      const isDark = systemThemeMediaQuery.matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', 'light');
    }
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
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        try {
          localStorage.setItem(STORAGE_KEY, legacyRaw);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch {
          // ignore
        }
      }
    }
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    if (parsed.version === 1) {
      const merged: Settings = { ...DEFAULT_SETTINGS, ...parsed };

      // Safe migration:
      // If legacy localhost base URL is stored while running on production/remote domains,
      // migrate to Render AI default. If on localhost, allow the developer override.
      const isLocalHost =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (
        (!isLocalHost && merged.ai?.apiBaseUrl === 'http://localhost:8000') ||
        !merged.ai?.apiBaseUrl
      ) {
        merged.ai = {
          ...merged.ai,
          apiBaseUrl: DEFAULT_API_BASE_URL,
        };
      }

      // If adapter was missing or empty, ensure Render AI is default
      if (!merged.ai?.adapter) {
        merged.ai = {
          ...merged.ai,
          adapter: DEFAULT_AI_ADAPTER,
        };
      }

      return merged;
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
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {}
    applyDomSettings(DEFAULT_SETTINGS);
    setAppLanguage(DEFAULT_SETTINGS.uiLang);
    set({ settings: DEFAULT_SETTINGS });
  },
}));
