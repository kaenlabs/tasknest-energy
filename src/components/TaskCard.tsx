import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/task.types';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { translate } from '../locales/i18n';
import { getCategoryIcon, getPriorityColor } from '../utils/taskHelpers';
import { OverdueActionCard } from './OverdueActionCard';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
  onPress?: () => void;
  animatedValue?: Animated.Value;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onPress,
  animatedValue = new Animated.Value(1),
}) => {
  const { theme } = useTheme();
  const { locale } = useLocale(); // This will trigger re-render on language change

  const energyColor = task.energy === 'high' ? theme.highEnergy : theme.lowEnergy;
  const energyIcon = task.energy === 'high' 
    ? translate('highEnergyIcon') 
    : translate('lowEnergyIcon');

  const animatedStyle = {
    opacity: animatedValue,
    transform: [
      {
        scale: animatedValue,
      },
    ],
  };

  // Check if task is overdue
  const isOverdue = task.status === 'overdue';

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderLeftColor: isOverdue ? '#EF4444' : energyColor,
            borderLeftWidth: isOverdue ? 6 : 4,
            shadowColor: theme.cardShadow,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={(e) => {
            e?.stopPropagation?.();
            onToggleComplete();
          }}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: task.completed ? theme.success : 'transparent',
                borderColor: task.completed ? theme.success : theme.border,
              },
            ]}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={18} color="#fff" />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View
                style={[
                  styles.priorityIndicator,
                  { backgroundColor: getPriorityColor(task.priority) },
                ]}
              />
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.text,
                    textDecorationLine: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1,
                  },
                ]}
              >
                {task.title}
              </Text>
            </View>
            <View style={styles.badges}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(task.category)}</Text>
              </View>
              <View style={styles.energyBadge}>
                <Text style={styles.energyIcon}>{energyIcon}</Text>
              </View>
            </View>
          </View>

          {task.note && (
            <Text
              style={[
                styles.note,
                {
                  color: theme.textSecondary,
                  opacity: task.completed ? 0.5 : 1,
                },
              ]}
              numberOfLines={2}
            >
              {task.note}
            </Text>
          )}

          {task.estimatedDuration && (
            <View style={styles.durationContainer}>
              <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.durationText, { color: theme.textSecondary }]}>
                {task.estimatedDuration}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e?.stopPropagation?.();
            onDelete();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Show overdue actions if task is overdue */}
      {isOverdue && <OverdueActionCard task={task} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  priorityIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryIcon: {
    fontSize: 16,
  },
  energyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  energyIcon: {
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
});
