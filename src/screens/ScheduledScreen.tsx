import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useAchievements } from '../context/AchievementContext';
import { usePoints, POINTS_CONFIG } from '../context/PointsContext';
import { translate } from '../locales/i18n';
import { Task } from '../types/task.types';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { PointsFloatingNotification } from '../components/PointsFloatingNotification';
import { LevelUpCelebration } from '../components/LevelUpCelebration';
import { hapticFeedback } from '../utils/haptics';

interface TaskSection {
  title: string;
  data: Task[];
  type: 'today' | 'upcoming' | 'overdue';
}

export const ScheduledScreen: React.FC = () => {
  const { theme } = useTheme();
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const { streak, updateStreak, checkAndUnlockAchievements } = useAchievements();
  const { addPoints } = usePoints();
  
  // Points animation states
  const [pointsNotification, setPointsNotification] = useState<{
    points: number;
    action: 'complete' | 'complete_on_time' | 'skip' | 'fail' | 'auto_fail';
  } | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number } | null>(null);

  const getScheduledTasks = (): TaskSection[] => {
    const scheduledTasks = tasks.filter(task => task.isScheduled && task.scheduledDate);
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;
    const upcomingEnd = todayStart + 7 * 24 * 60 * 60 * 1000;

    const todayTasks = scheduledTasks.filter(task => 
      task.scheduledDate! >= todayStart && task.scheduledDate! < todayEnd
    ).sort((a, b) => {
      // Sort by time
      if (a.scheduledTime && b.scheduledTime) {
        return a.scheduledTime.localeCompare(b.scheduledTime);
      }
      return 0;
    });

    const overdueTasks = scheduledTasks.filter(task => 
      task.scheduledDate! < todayStart && !task.completed
    ).sort((a, b) => b.scheduledDate! - a.scheduledDate!);

    const upcomingTasks = scheduledTasks.filter(task => 
      task.scheduledDate! >= todayEnd && task.scheduledDate! < upcomingEnd
    ).sort((a, b) => a.scheduledDate! - b.scheduledDate!);

    const sections: TaskSection[] = [];
    
    if (overdueTasks.length > 0) {
      sections.push({
        title: translate('scheduled.overdue'),
        data: overdueTasks,
        type: 'overdue',
      });
    }

    if (todayTasks.length > 0) {
      sections.push({
        title: translate('scheduled.today'),
        data: todayTasks,
        type: 'today',
      });
    }

    if (upcomingTasks.length > 0) {
      sections.push({
        title: translate('scheduled.upcoming'),
        data: upcomingTasks,
        type: 'upcoming',
      });
    }

    return sections;
  };

  const handleToggleComplete = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const task = tasks.find((t) => t.id === id);
    
    if (task && !task.completed) {
      // Completing a task - success haptic!
      hapticFeedback.medium();
      
      // Calculate points based on task timing
      let points = POINTS_CONFIG.COMPLETE_NORMAL;
      let action: 'complete' | 'complete_on_time' = 'complete';
      
      // Check if task has schedule and completed on time
      if (task.scheduledDate && task.scheduledTime) {
        const [hours, minutes] = task.scheduledTime.split(':').map(Number);
        const scheduledDateTime = new Date(task.scheduledDate);
        scheduledDateTime.setHours(hours, minutes, 0, 0);
        
        if (Date.now() < scheduledDateTime.getTime()) {
          // Completed before scheduled time - bonus!
          points = POINTS_CONFIG.COMPLETE_ON_TIME;
          action = 'complete_on_time';
        }
      }
      
      // Add points and check for level up
      const result = await addPoints(task.id, task.title, points, action);
      
      // Show points notification
      setPointsNotification({ points, action });
      
      // Show level up celebration if leveled up
      if (result.leveledUp) {
        setTimeout(() => {
          setLevelUpData({ level: result.newLevel });
        }, 2000);
      }
      
      await updateStreak();
      
      // Check achievements after a small delay to get updated tasks
      setTimeout(async () => {
        const completedCount = tasks.filter((t) => t.completed).length + 1;
        await checkAndUnlockAchievements(completedCount, tasks);
      }, 100);
    } else {
      // Uncompleting a task - light feedback
      hapticFeedback.light();
    }
    
    toggleTaskCompletion(id);
  };

  const handleDelete = (id: string) => {
    hapticFeedback.warning();
    deleteTask(id);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return translate('scheduled.today');
    if (isTomorrow) return 'Yarın'; // TODO: Add to translations

    return date.toLocaleDateString('tr-TR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const sections = getScheduledTasks();

  if (sections.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {translate('scheduled.noScheduled')}
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
            {translate('scheduled.noScheduledDesc')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {item.scheduledDate && (
              <View style={styles.dateRow}>
                <Ionicons name="calendar" size={14} color={theme.textSecondary} />
                <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                  {formatDate(item.scheduledDate)}
                </Text>
                {item.scheduledTime && (
                  <>
                    <Ionicons name="time" size={14} color={theme.textSecondary} style={{ marginLeft: 12 }} />
                    <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                      {item.scheduledTime}
                    </Text>
                  </>
                )}
              </View>
            )}
            <TaskCard
              task={item}
              onToggleComplete={() => handleToggleComplete(item.id)}
              onDelete={() => handleDelete(item.id)}
              onPress={() => {
                // TODO: Open detail modal
              }}
            />
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.sectionHeader,
              {
                backgroundColor: theme.surface,
                borderLeftColor:
                  section.type === 'overdue'
                    ? '#EF4444'
                    : section.type === 'today'
                    ? theme.primary
                    : theme.success,
              },
            ]}
          >
            <Ionicons
              name={
                section.type === 'overdue'
                  ? 'alert-circle'
                  : section.type === 'today'
                  ? 'calendar-outline'
                  : 'time-outline'
              }
              size={20}
              color={
                section.type === 'overdue'
                  ? '#EF4444'
                  : section.type === 'today'
                  ? theme.primary
                  : theme.success
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    section.type === 'overdue'
                      ? '#EF4444'
                      : section.type === 'today'
                      ? theme.primary
                      : theme.success,
                },
              ]}
            >
              {section.title}
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>
                {section.data.length}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />

      {/* Points Floating Notification */}
      {pointsNotification && (
        <PointsFloatingNotification
          points={pointsNotification.points}
          action={pointsNotification.action}
          onAnimationComplete={() => setPointsNotification(null)}
        />
      )}

      {/* Level Up Celebration */}
      {levelUpData && (
        <LevelUpCelebration
          level={levelUpData.level}
          onAnimationComplete={() => setLevelUpData(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
