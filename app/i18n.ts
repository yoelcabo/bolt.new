import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import translationCA from '../public/locales/ca/translation.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ca',
    fallbackLng: 'en',
    supportedLngs: ['ca', 'es', 'en'],
    load: 'languageOnly',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ca: {
        translation: translationCA
      }
    }
  });

export default i18n;
