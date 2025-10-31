import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { LocaleProvider } from './src/context/LocaleContext';
import { TaskProvider } from './src/context/TaskContext';
import { MainNavigator } from './src/navigation/MainNavigator';
import { SplashScreen } from './src/components/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

const ONBOARDING_KEY = '@TaskNest:onboarding_completed';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (value === null) {
        // First time user
        setShowOnboarding(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsLoading(false);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleOnboardingFinish = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setShowOnboarding(false);
    }
  };

  if (isLoading) {
    return null; // or a simple loading view
  }

  if (showSplash) {
    return (
      <ThemeProvider>
        <SplashScreen onFinish={handleSplashFinish} />
      </ThemeProvider>
    );
  }

  if (showOnboarding) {
    return (
      <ThemeProvider>
        <LocaleProvider>
          <OnboardingScreen onFinish={handleOnboardingFinish} />
        </LocaleProvider>
      </ThemeProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LocaleProvider>
          <TaskProvider>
            <MainNavigator />
          </TaskProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
