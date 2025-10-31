import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocale, getCurrentLocale } from '../locales/i18n';
import { getLocales } from 'expo-localization';

interface LocaleContextType {
  locale: string;
  changeLocale: (locale: string) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = '@TaskNest:locale';

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>(getLocales()[0].languageCode ?? 'en');

  useEffect(() => {
    loadLocale();
  }, []);

  const loadLocale = async () => {
    try {
      const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
      if (savedLocale) {
        setLocaleState(savedLocale);
        setLocale(savedLocale);
      } else {
        const deviceLocale = getLocales()[0].languageCode ?? 'en';
        setLocaleState(deviceLocale);
        setLocale(deviceLocale);
      }
    } catch (error) {
      console.error('Error loading locale:', error);
    }
  };

  const changeLocale = async (newLocale: string) => {
    try {
      setLocaleState(newLocale);
      setLocale(newLocale);
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch (error) {
      console.error('Error saving locale:', error);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
