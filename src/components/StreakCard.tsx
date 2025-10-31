import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { translate } from '../locales/i18n';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, longestStreak }) => {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentStreak > 0) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [currentStreak]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.streakSection}>
        <View style={styles.iconContainer}>
          {currentStreak > 0 && (
            <Animated.View
              style={[
                styles.glow,
                {
                  opacity: glowOpacity,
                  backgroundColor: '#FF5722',
                },
              ]}
            />
          )}
          <Animated.Text
            style={[
              styles.fireEmoji,
              {
                transform: [{ scale: currentStreak > 0 ? scaleAnim : 1 }],
              },
            ]}
          >
            🔥
          </Animated.Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.streakNumber, { color: theme.text }]}>
            {currentStreak} {translate('streak.days')}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.textSecondary }]}>
            {translate('streak.current')}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.longestSection}>
        <Text style={[styles.longestNumber, { color: theme.primary }]}>
          {longestStreak}
        </Text>
        <Text style={[styles.longestLabel, { color: theme.textSecondary }]}>
          {translate('streak.longest')}
        </Text>
      </View>

      {currentStreak === 0 && (
        <View style={[styles.motivationBadge, { backgroundColor: theme.primary + '15' }]}>
          <Text style={[styles.motivationText, { color: theme.primary }]}>
            {translate('streak.startToday')}
          </Text>
        </View>
      )}

      {currentStreak >= 3 && (
        <View style={[styles.motivationBadge, { backgroundColor: '#FF5722' + '15' }]}>
          <Text style={[styles.motivationText, { color: '#FF5722' }]}>
            {translate('streak.keepGoing')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  glow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
  },
  fireEmoji: {
    fontSize: 48,
  },
  textContainer: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  longestSection: {
    alignItems: 'center',
  },
  longestNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  longestLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  motivationBadge: {
    marginTop: 12,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
