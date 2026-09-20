/**
 * i18next configuration for AgriMart marketplace.
 * Supports English (en) and Hindi (hi) with localStorage persistence.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';

const STORAGE_KEY = 'agrimart_lang';
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const initialLanguage = savedLanguage === 'hi' ? 'hi' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Update HTML lang attribute and persist in localStorage on change
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage;
}

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
