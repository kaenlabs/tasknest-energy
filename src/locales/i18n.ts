import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { tr } from './tr';
import { en } from './en';

const i18n = new I18n({
  en,
  tr,
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';

// When a value is missing from a language, it'll fallback to another language.
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const translate = (key: string, config?: any) => i18n.t(key, config);

export const setLocale = (locale: string) => {
  i18n.locale = locale;
};

export const getCurrentLocale = () => i18n.locale;

export default i18n;
