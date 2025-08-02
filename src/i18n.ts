// src/i18n.ts
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import tr from './locales/tr.json';

const savedLang = localStorage.getItem('lang') || 'tr';

const i18n = createI18n({
  legacy: false,
  locale: savedLang, // başlangıç dili
  fallbackLocale: 'tr',
  messages: {
    en,
    tr,
  },
});

export default i18n;
