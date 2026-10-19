import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './fr.json';
import ar from './ar.json';
import en from './en.json';
import { UiLang } from '@/types/domain';

export const resources = {
  fr: { translation: fr },
  ar: { translation: ar },
  en: { translation: en },
} as const;

// Determine saved preference explicitly from localStorage if it exists
function getSavedLanguage(): UiLang | null {
  if (typeof window === 'undefined') return null;
  try {
    let raw = localStorage.getItem('connectsign.i18n.lang');
    if (!raw) {
      const legacyRaw = localStorage.getItem('lsab.i18n.lang');
      if (legacyRaw) {
        raw = legacyRaw;
        try {
          localStorage.setItem('connectsign.i18n.lang', legacyRaw);
          localStorage.removeItem('lsab.i18n.lang');
        } catch {
          // ignore
        }
      }
    }
    if (raw === 'fr' || raw === 'ar' || raw === 'en') {
      return raw;
    }
  } catch {
    // Storage access might fail in restricted iframe or private mode
  }
  return null;
}

const initialSavedLang = getSavedLanguage();
const initialLanguage = initialSavedLang || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'connectsign.i18n.lang',
    },
  });

export function updateHtmlDirAndLang(lang: string) {
  const isRtl = lang === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
}

i18n.on('languageChanged', (lng) => {
  updateHtmlDirAndLang(lng);
});

// Initial setup with English default
updateHtmlDirAndLang(initialLanguage);

export const setAppLanguage = (lang: UiLang) => {
  i18n.changeLanguage(lang);
  updateHtmlDirAndLang(lang);
};

export default i18n;
