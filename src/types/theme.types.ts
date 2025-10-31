export type ColorScheme = 'light' | 'dark';

export interface Theme {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  success: string;
  lowEnergy: string;
  highEnergy: string;
  cardShadow: string;
  border: string;
}

export const lightTheme: Theme = {
  background: '#F8F6F4',
  surface: '#FFFFFF',
  text: '#2D2D2D',
  textSecondary: '#6B7280',
  primary: '#B4A5D6',
  primaryLight: '#E5DFF7',
  secondary: '#D4C5E2',
  success: '#A8D5BA',
  lowEnergy: '#93C5FD',
  highEnergy: '#FCD34D',
  cardShadow: 'rgba(0, 0, 0, 0.08)',
  border: '#E5E7EB',
};

export const darkTheme: Theme = {
  background: '#1F2937',
  surface: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  primary: '#9F7AEA',
  primaryLight: '#6B46C1',
  secondary: '#805AD5',
  success: '#68D391',
  lowEnergy: '#60A5FA',
  highEnergy: '#FBBF24',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  border: '#4B5563',
};
