import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme, Theme, lightTheme, darkTheme } from '../types/theme.types';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  colorScheme: ColorScheme;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@TaskNest:theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() as ColorScheme;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemColorScheme || 'light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setColorScheme(savedTheme as ColorScheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (scheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
    saveTheme(newScheme);
  };

  const setTheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    saveTheme(scheme);
  };

  const theme = colorScheme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ colorScheme, theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
