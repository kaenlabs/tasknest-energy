import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { useAchievements } from '../context/AchievementContext';
import { translate } from '../locales/i18n';
import { Category, Priority } from '../types/task.types';
import { getCategoryIcon, getCategoryColor, getPriorityColor } from '../utils/taskHelpers';
import { AchievementCard } from '../components/AchievementCard';
import { NotificationSettingsScreen } from './NotificationSettingsScreen';
import { hapticFeedback } from '../utils/haptics';

const { width } = Dimensions.get('window');

export const StatsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { locale } = useLocale(); // This will trigger re-render on language change
  const { tasks } = useTasks();
  const { achievements } = useAchievements();
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Weekly completion data (last 7 days)
  const getWeeklyData = () => {
    const weekData = Array(7).fill(0);
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    completedTasks.forEach((task) => {
      if (task.completedAt) {
        const daysAgo = Math.floor((now - task.completedAt) / dayMs);
        if (daysAgo < 7) {
          weekData[6 - daysAgo]++;
        }
      }
    });

    return weekData;
  };

  const weeklyData = getWeeklyData();
  const maxWeeklyValue = Math.max(...weeklyData, 1);

  // Category stats
  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  // Priority stats
  const priorityStats = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<Priority, number>);

  const weekDays = [
    translate('weekDays.mon'),
    translate('weekDays.tue'),
    translate('weekDays.wed'),
    translate('weekDays.thu'),
    translate('weekDays.fri'),
    translate('weekDays.sat'),
    translate('weekDays.sun'),
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {translate('statistics')}
        </Text>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.surface }]}
          onPress={() => {
            hapticFeedback.selection();
            setShowNotificationSettings(true);
          }}
        >
          <Ionicons name="notifications" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Ionicons name="list" size={32} color={theme.primary} />
            <Text style={[styles.statNumber, { color: theme.text }]}>{tasks.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {translate('totalTasks')}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Ionicons name="checkmark-circle" size={32} color={theme.success} />
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {completedTasks.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {translate('completedCount')}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Ionicons name="time" size={32} color={theme.highEnergy} />
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {pendingTasks.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {translate('pendingCount')}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Ionicons name="trending-up" size={32} color={theme.primary} />
            <Text style={[styles.statNumber, { color: theme.text }]}>{completionRate}%</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {translate('completionRate')}
            </Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {translate('thisWeek')}
          </Text>
          <View style={styles.chart}>
            {weeklyData.map((value, index) => (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(value / maxWeeklyValue) * 100}%`,
                      backgroundColor: theme.primary,
                      minHeight: value > 0 ? 4 : 0,
                    },
                  ]}
                />
                <Text style={[styles.barLabel, { color: theme.textSecondary }]}>
                  {weekDays[index]}
                </Text>
                <Text style={[styles.barValue, { color: theme.text }]}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Distribution */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {translate('categoryDistribution')}
          </Text>
          <View style={styles.categoryList}>
            {(['work', 'personal', 'health', 'shopping', 'other'] as Category[]).map(
              (category) => {
                const count = categoryStats[category] || 0;
                const percentage =
                  tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;

                return (
                  <View key={category} style={styles.categoryItem}>
                    <View style={styles.categoryLeft}>
                      <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
                      <Text style={[styles.categoryName, { color: theme.text }]}>
                        {translate(`categories.${category}`)}
                      </Text>
                    </View>
                    <View style={styles.categoryRight}>
                      <View
                        style={[
                          styles.progressBar,
                          { backgroundColor: theme.border, width: 80 },
                        ]}
                      >
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${percentage}%`,
                              backgroundColor: getCategoryColor(category),
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.categoryCount, { color: theme.text }]}>
                        {count}
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        </View>

        {/* Priority Distribution */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {translate('priorityDistribution')}
          </Text>
          <View style={styles.priorityList}>
            {(['high', 'medium', 'low'] as Priority[]).map((priority) => {
              const count = priorityStats[priority] || 0;

              return (
                <View
                  key={priority}
                  style={[
                    styles.priorityItem,
                    {
                      backgroundColor: getPriorityColor(priority) + '15',
                      borderLeftColor: getPriorityColor(priority),
                    },
                  ]}
                >
                  <View style={styles.priorityLeft}>
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(priority) },
                      ]}
                    />
                    <Text style={[styles.priorityName, { color: theme.text }]}>
                      {translate(`priority.${priority}`)}
                    </Text>
                  </View>
                  <Text style={[styles.priorityCount, { color: theme.text }]}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Achievements */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <View style={styles.achievementHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {translate('achievements.title')}
            </Text>
            <Text style={[styles.achievementCount, { color: theme.primary }]}>
              {achievements.filter((a) => a.unlocked).length} / {achievements.length}
            </Text>
          </View>

          <View style={styles.achievementList}>
            {achievements.slice(0, 6).map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </View>

          {achievements.length > 6 && (
            <Text style={[styles.moreText, { color: theme.textSecondary }]}>
              {achievements.length - 6} more achievements...
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Notification Settings Modal */}
      <Modal
        visible={showNotificationSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationSettings(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface }]}>
            <TouchableOpacity
              onPress={() => {
                hapticFeedback.light();
                setShowNotificationSettings(false);
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>
          <NotificationSettingsScreen />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'right',
  },
  priorityList: {
    gap: 12,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  priorityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityName: {
    fontSize: 16,
    fontWeight: '600',
  },
  priorityCount: {
    fontSize: 20,
    fontWeight: '700',
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementCount: {
    fontSize: 18,
    fontWeight: '700',
  },
  achievementList: {
    marginTop: 8,
  },
  moreText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
  },
});
