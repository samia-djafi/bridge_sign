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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'ar', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lsab.i18n.lang',
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

// Initial setup
updateHtmlDirAndLang(i18n.resolvedLanguage || 'fr');

export const setAppLanguage = (lang: UiLang) => {
  i18n.changeLanguage(lang);
  updateHtmlDirAndLang(lang);
};

export default i18n;
