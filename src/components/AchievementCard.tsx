import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '../types/achievement.types';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { translate } from '../locales/i18n';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { theme } = useTheme();
  const { locale } = useLocale();

  const progressPercentage =
    achievement.target > 0 ? Math.min((achievement.progress / achievement.target) * 100, 100) : 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: achievement.unlocked ? achievement.color + '15' : theme.surface,
          borderColor: achievement.unlocked ? achievement.color : theme.border,
          opacity: achievement.unlocked ? 1 : 0.6,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, { opacity: achievement.unlocked ? 1 : 0.4 }]}>
          {achievement.icon}
        </Text>
        {achievement.unlocked && (
          <View style={[styles.unlockBadge, { backgroundColor: achievement.color }]}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          {translate(achievement.titleKey)}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {translate(achievement.descriptionKey)}
        </Text>

        {!achievement.unlocked && (
          <>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: achievement.color,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {achievement.progress} / {achievement.target}
            </Text>
          </>
        )}

        {achievement.unlocked && achievement.unlockedAt && (
          <Text style={[styles.unlockedDate, { color: achievement.color }]}>
            {translate('achievements.unlocked')} •{' '}
            {new Date(achievement.unlockedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  icon: {
    fontSize: 48,
  },
  unlockBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  unlockedDate: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
