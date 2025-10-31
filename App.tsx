import React, { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { LocaleProvider } from './src/context/LocaleContext';
import { TaskProvider } from './src/context/TaskContext';
import { AchievementProvider } from './src/context/AchievementContext';
import { PointsProvider } from './src/context/PointsContext';
import { MainNavigator } from './src/navigation/MainNavigator';
import { SplashScreen } from './src/components/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { initializeNotifications } from './src/services/notificationService';

const ONBOARDING_KEY = '@TaskNest:onboarding_completed';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Animation values
  const onboardingFadeAnim = useRef(new Animated.Value(0)).current;
  const onboardingSlideAnim = useRef(new Animated.Value(50)).current;
  const appFadeAnim = useRef(new Animated.Value(0)).current;
  const appScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    checkOnboardingStatus();
    initializeNotifications();
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
    // Animate onboarding entrance
    if (showOnboarding) {
      Animated.parallel([
        Animated.timing(onboardingFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(onboardingSlideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Directly show app with animation
      Animated.parallel([
        Animated.timing(appFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(appScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleOnboardingFinish = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      
      // Animate onboarding exit and app entrance
      Animated.parallel([
        Animated.timing(onboardingFadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(onboardingSlideAnim, {
          toValue: -30,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowOnboarding(false);
        
        // Animate app entrance
        Animated.parallel([
          Animated.timing(appFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(appScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      });
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
      <Animated.View
        style={{
          flex: 1,
          opacity: onboardingFadeAnim,
          transform: [{ translateY: onboardingSlideAnim }],
        }}
      >
        <ThemeProvider>
          <LocaleProvider>
            <OnboardingScreen onFinish={handleOnboardingFinish} />
          </LocaleProvider>
        </ThemeProvider>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: appFadeAnim,
        transform: [{ scale: appScaleAnim }],
      }}
    >
      <SafeAreaProvider>
        <ThemeProvider>
          <LocaleProvider>
            <TaskProvider>
              <PointsProvider>
                <AchievementProvider>
                  <MainNavigator />
                </AchievementProvider>
              </PointsProvider>
            </TaskProvider>
          </LocaleProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Animated.View>
  );
}
