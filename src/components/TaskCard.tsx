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
import { translate } from '../locales/i18n';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
  animatedValue?: Animated.Value;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  animatedValue = new Animated.Value(1),
}) => {
  const { theme } = useTheme();

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

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderLeftColor: energyColor,
            shadowColor: theme.cardShadow,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={onToggleComplete}
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
            <View style={styles.energyBadge}>
              <Text style={styles.energyIcon}>{energyIcon}</Text>
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
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  energyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  energyIcon: {
    fontSize: 18,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
});
