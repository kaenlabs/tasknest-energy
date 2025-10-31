import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { usePoints, POINTS_CONFIG } from '../context/PointsContext';
import { translate } from '../locales/i18n';
import { hapticFeedback } from '../utils/haptics';
import { Task } from '../types/task.types';

interface OverdueActionCardProps {
  task: Task;
}

export const OverdueActionCard: React.FC<OverdueActionCardProps> = ({ task }) => {
  const { theme } = useTheme();
  const { toggleTaskCompletion, markTaskAsSkipped, markTaskAsFailed } = useTasks();
  const { addPoints } = usePoints();

  // Calculate time passed since due time
  const getTimePassed = (): string => {
    if (!task.scheduledDate || !task.scheduledTime) return '';

    const [hours, minutes] = task.scheduledTime.split(':').map(Number);
    const scheduledDateTime = new Date(task.scheduledDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    const now = Date.now();
    const diffMs = now - scheduledDateTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? translate('day') : translate('days')} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? translate('hour') : translate('hours')} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} ${diffMins === 1 ? translate('minute') : translate('minutes')} ago`;
    }
    return translate('just_now');
  };

  const handleCompleted = async () => {
    hapticFeedback.success();
    
    // Mark as completed
    toggleTaskCompletion(task.id);
    
    // Add points
    await addPoints(
      task.id,
      task.title,
      POINTS_CONFIG.COMPLETE_NORMAL,
      'complete'
    );

    Alert.alert(
      '✅ ' + translate('task_completed'),
      `+${POINTS_CONFIG.COMPLETE_NORMAL} ${translate('points')}`,
      [{ text: translate('ok') }]
    );
  };

  const handleSkipped = () => {
    hapticFeedback.warning();
    
    Alert.alert(
      '⏭️ ' + translate('skip_task'),
      translate('skip_task_confirmation'),
      [
        {
          text: translate('cancel'),
          style: 'cancel',
        },
        {
          text: translate('skip'),
          style: 'destructive',
          onPress: async () => {
            markTaskAsSkipped(task.id);
            await addPoints(
              task.id,
              task.title,
              POINTS_CONFIG.SKIP,
              'skip'
            );
          },
        },
      ]
    );
  };

  const handleFailed = () => {
    hapticFeedback.error();
    
    Alert.alert(
      '❌ ' + translate('mark_as_failed'),
      translate('fail_task_confirmation'),
      [
        {
          text: translate('cancel'),
          style: 'cancel',
        },
        {
          text: translate('mark_failed'),
          style: 'destructive',
          onPress: async () => {
            markTaskAsFailed(task.id);
            await addPoints(
              task.id,
              task.title,
              POINTS_CONFIG.FAIL,
              'fail'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Overdue Badge */}
      <View style={[styles.overdueBadge, { backgroundColor: '#EF4444' }]}>
        <Ionicons name="alert-circle" size={16} color="white" />
        <Text style={styles.overdueText}>
          {translate('overdue')} • {getTimePassed()}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {/* Completed */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}
          onPress={handleCompleted}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
          <Text style={[styles.actionText, { color: theme.primary }]}>
            {translate('completed')}
          </Text>
          <Text style={[styles.pointsText, { color: theme.primary }]}>
            +{POINTS_CONFIG.COMPLETE_NORMAL}
          </Text>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F59E0B' + '20', borderColor: '#F59E0B' }]}
          onPress={handleSkipped}
          activeOpacity={0.7}
        >
          <Ionicons name="play-skip-forward" size={24} color="#F59E0B" />
          <Text style={[styles.actionText, { color: '#F59E0B' }]}>
            {translate('skip')}
          </Text>
          <Text style={[styles.pointsText, { color: '#F59E0B' }]}>
            {POINTS_CONFIG.SKIP}
          </Text>
        </TouchableOpacity>

        {/* Failed */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#EF4444' + '20', borderColor: '#EF4444' }]}
          onPress={handleFailed}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={24} color="#EF4444" />
          <Text style={[styles.actionText, { color: '#EF4444' }]}>
            {translate('failed')}
          </Text>
          <Text style={[styles.pointsText, { color: '#EF4444' }]}>
            {POINTS_CONFIG.FAIL}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    gap: 6,
  },
  overdueText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
