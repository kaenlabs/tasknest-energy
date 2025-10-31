import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/task.types';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../locales/i18n';
import {
  getCategoryIcon,
  getCategoryColor,
  getPriorityColor,
} from '../utils/taskHelpers';

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  visible,
  task,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  if (!task) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {translate('taskDetails')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.section}>
              <Text style={[styles.title, { color: theme.text }]}>
                {task.title}
              </Text>
              {task.completed && (
                <View style={[styles.completedBadge, { backgroundColor: theme.success + '20' }]}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                  <Text style={[styles.completedText, { color: theme.success }]}>
                    {translate('taskCompleted')}
                  </Text>
                </View>
              )}
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              {/* Category */}
              <View style={[styles.detailCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  {translate('ai.category')}
                </Text>
                <View style={styles.detailValue}>
                  <Text style={{ fontSize: 20 }}>{getCategoryIcon(task.category)}</Text>
                  <Text style={[styles.detailText, { color: theme.text }]}>
                    {translate(`categories.${task.category}`)}
                  </Text>
                </View>
              </View>

              {/* Priority */}
              <View style={[styles.detailCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  {translate('ai.priority')}
                </Text>
                <View style={styles.detailValue}>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(task.priority) },
                    ]}
                  />
                  <Text style={[styles.detailText, { color: theme.text }]}>
                    {translate(`priority.${task.priority}`)}
                  </Text>
                </View>
              </View>

              {/* Energy */}
              <View style={[styles.detailCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  {translate('ai.energy')}
                </Text>
                <View style={styles.detailValue}>
                  <Text style={{ fontSize: 20 }}>
                    {task.energy === 'high' ? '⚡' : '💤'}
                  </Text>
                  <Text style={[styles.detailText, { color: theme.text }]}>
                    {task.energy === 'high' ? translate('highEnergy') : translate('lowEnergy')}
                  </Text>
                </View>
              </View>

              {/* Duration */}
              {task.estimatedDuration && (
                <View style={[styles.detailCard, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                    {translate('ai.duration')}
                  </Text>
                  <View style={styles.detailValue}>
                    <Ionicons name="time-outline" size={20} color={theme.primary} />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {task.estimatedDuration}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Note */}
            {task.note && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  📝 {translate('taskNote')}
                </Text>
                <View style={[styles.noteBox, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.noteText, { color: theme.text }]}>
                    {task.note}
                  </Text>
                </View>
              </View>
            )}

            {/* Timestamps */}
            <View style={styles.section}>
              <Text style={[styles.timestampText, { color: theme.textSecondary }]}>
                📅 {new Date(task.createdAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              {task.completedAt && (
                <Text style={[styles.timestampText, { color: theme.textSecondary }]}>
                  ✅ {new Date(task.completedAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton, { backgroundColor: theme.primary }]}
              onPress={onEdit}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>{translate('editTask')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton, { backgroundColor: '#EF4444' }]}
              onPress={onDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>{translate('deleteTask')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginTop: 8,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '600',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  noteBox: {
    padding: 16,
    borderRadius: 16,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
  },
  timestampText: {
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  editButton: {},
  deleteButton: {},
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
