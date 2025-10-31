import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../locales/i18n';

const { width, height } = Dimensions.get('window');

interface TutorialStep {
  title: string;
  description: string;
  targetPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  arrow?: 'top' | 'bottom' | 'left' | 'right';
}

interface AppTutorialProps {
  visible: boolean;
  onComplete: () => void;
  steps: TutorialStep[];
}

export const AppTutorial: React.FC<AppTutorialProps> = ({
  visible,
  onComplete,
  steps,
}) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, currentStep]);

  if (!visible || currentStep >= steps.length) {
    return null;
  }

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(0);
      onComplete();
    });
  };

  const renderSpotlight = () => {
    const { x, y, width: spotWidth, height: spotHeight } = step.targetPosition;
    const spotlightRadius = Math.max(spotWidth, spotHeight) / 2 + 20;

    return (
      <Animated.View
        style={[
          styles.spotlight,
          {
            left: x + spotWidth / 2 - spotlightRadius,
            top: y + spotHeight / 2 - spotlightRadius,
            width: spotlightRadius * 2,
            height: spotlightRadius * 2,
            borderRadius: spotlightRadius,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
    );
  };

  const renderArrow = () => {
    if (!step.arrow) return null;

    const { x, y, width: spotWidth, height: spotHeight } = step.targetPosition;
    let arrowStyle: any = {};
    let rotation = '0deg';

    switch (step.arrow) {
      case 'bottom':
        arrowStyle = {
          left: x + spotWidth / 2 - 15,
          top: y - 50,
        };
        rotation = '180deg';
        break;
      case 'top':
        arrowStyle = {
          left: x + spotWidth / 2 - 15,
          top: y + spotHeight + 10,
        };
        rotation = '0deg';
        break;
      case 'left':
        arrowStyle = {
          left: x + spotWidth + 10,
          top: y + spotHeight / 2 - 15,
        };
        rotation = '270deg';
        break;
      case 'right':
        arrowStyle = {
          left: x - 40,
          top: y + spotHeight / 2 - 15,
        };
        rotation = '90deg';
        break;
    }

    return (
      <Animated.View
        style={[
          styles.arrow,
          arrowStyle,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Ionicons name="arrow-down" size={30} color={theme.primary} />
      </Animated.View>
    );
  };

  const renderTooltip = () => {
    const { y, height: spotHeight } = step.targetPosition;
    const isTopHalf = y < height / 2;

    return (
      <View
        style={[
          styles.tooltip,
          {
            backgroundColor: theme.surface,
            top: isTopHalf ? y + spotHeight + 80 : undefined,
            bottom: isTopHalf ? undefined : height - y + 80,
          },
        ]}
      >
        <Text style={[styles.tooltipTitle, { color: theme.text }]}>
          {step.title}
        </Text>
        <Text style={[styles.tooltipDescription, { color: theme.textSecondary }]}>
          {step.description}
        </Text>

        <View style={styles.tooltipActions}>
          <View style={styles.stepIndicator}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  {
                    backgroundColor:
                      currentStep === index ? theme.primary : theme.border,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonGroup}>
            {currentStep < steps.length - 1 && (
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={[styles.skipText, { color: theme.textSecondary }]}>
                  {translate('tutorial.skip')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: theme.primary }]}
              onPress={handleNext}
            >
              <Text style={styles.nextText}>
                {currentStep === steps.length - 1
                  ? translate('tutorial.gotIt')
                  : translate('tutorial.next')}
              </Text>
              {currentStep < steps.length - 1 && (
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {renderSpotlight()}
        {renderArrow()}
        {renderTooltip()}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  spotlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    borderColor: 'rgba(180, 165, 214, 0.6)',
  },
  arrow: {
    position: 'absolute',
  },
  tooltip: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  tooltipDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tooltipActions: {
    gap: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
