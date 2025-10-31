import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Achievement } from '../types/achievement.types';
import { ACHIEVEMENT_DEFINITIONS } from '../utils/achievementData';
import { translate } from '../locales/i18n';

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
}

const { width } = Dimensions.get('window');

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss,
}) => {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const achievementDef = ACHIEVEMENT_DEFINITIONS[achievement.id];

  useEffect(() => {
    // Slide in from top with bounce
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Auto dismiss after 4 seconds
    const timer = setTimeout(() => {
      dismissNotification();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const dismissNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 215, 0, 0)', 'rgba(255, 215, 0, 0.3)'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            shadowColor: glowColor,
            shadowRadius: 20,
            shadowOpacity: 1,
          },
        ]}
      >
        {/* Header with trophy icon */}
        <View style={styles.header}>
          <View style={[styles.trophyBadge, { backgroundColor: achievementDef.color + '20' }]}>
            <Ionicons name="trophy" size={24} color={achievementDef.color} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.text }]}>
              🎉 Achievement Unlocked!
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Başarı Kazandın!
            </Text>
          </View>
        </View>

        {/* Achievement details */}
        <View style={styles.content}>
          <View style={styles.achievementIcon}>
            <Text style={styles.icon}>{achievementDef.icon}</Text>
          </View>
          <View style={styles.details}>
            <Text style={[styles.achievementName, { color: theme.text }]}>
              {translate(achievementDef.titleKey)}
            </Text>
            <Text style={[styles.achievementDesc, { color: theme.textSecondary }]}>
              {translate(achievementDef.descriptionKey)}
            </Text>
          </View>
        </View>

        {/* Progress bar - completed */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: achievementDef.color,
                  width: '100%',
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: achievementDef.color }]}>
            {achievementDef.target}/{achievementDef.target} ✓
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10000,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trophyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD70020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  details: {
    flex: 1,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
