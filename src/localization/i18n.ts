import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './translation/en';

const LANGUAGES = {
  en,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: LANGUAGES,
  lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
