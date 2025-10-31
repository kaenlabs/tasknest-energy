import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../locales/i18n';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinish: () => void;
}

interface SlideData {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideScaleAnim = useRef(new Animated.Value(1)).current;
  const slideOpacityAnim = useRef(new Animated.Value(1)).current;

  const slides: SlideData[] = [
    {
      icon: 'flash',
      title: translate('onboarding.slide1.title'),
      description: translate('onboarding.slide1.description'),
      color: '#FCD34D',
    },
    {
      icon: 'time',
      title: translate('onboarding.slide2.title'),
      description: translate('onboarding.slide2.description'),
      color: '#93C5FD',
    },
    {
      icon: 'color-palette',
      title: translate('onboarding.slide3.title'),
      description: translate('onboarding.slide3.description'),
      color: '#B4A5D6',
    },
    {
      icon: 'rocket',
      title: translate('onboarding.slide4.title'),
      description: translate('onboarding.slide4.description'),
      color: '#A8D5BA',
    },
  ];



  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    Animated.sequence([
      // Button press animation
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      // Exit animation - zoom out and fade
      Animated.parallel([
        Animated.timing(slideScaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideOpacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.background,
          opacity: slideOpacityAnim,
          transform: [{ scale: slideScaleAnim }],
        }
      ]}
    >
      <TouchableOpacity
        style={styles.skipButton}
        onPress={onFinish}
        activeOpacity={0.7}
      >
        <Text style={[styles.skipText, { color: theme.textSecondary }]}>
          {translate('onboarding.skip')}
        </Text>
      </TouchableOpacity>

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.slideContent}>
              <View style={[styles.iconContainer, { backgroundColor: slide.color + '20' }]}>
                <Ionicons name={slide.icon} size={80} color={slide.color} />
              </View>

              <Text style={[styles.title, { color: theme.text }]}>{slide.title}</Text>
              <Text style={[styles.description, { color: theme.textSecondary }]}>
                {slide.description}
              </Text>
            </View>
          </View>
        ))}
      </PagerView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    currentPage === index ? theme.primary : theme.border,
                  width: currentPage === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {currentPage === slides.length - 1
                ? translate('onboarding.getStarted')
                : translate('onboarding.next')}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pagerView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
