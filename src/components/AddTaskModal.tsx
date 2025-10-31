import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Task, EnergyLevel, Priority, Category } from '../types/task.types';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { getTaskSuggestions, TaskSuggestion } from '../services/aiService';
import { hapticFeedback } from '../utils/haptics';
import { translate } from '../locales/i18n';
import i18n from '../locales/i18n';
import {
  getCategoryIcon,
  getCategoryColor,
  getPriorityColor,
} from '../utils/taskHelpers';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    note: string,
    energy: EnergyLevel,
    priority: Priority,
    category: Category,
    estimatedDuration?: string,
    scheduledDate?: number,
    scheduledTime?: string
  ) => void;
  editTask?: Task | null; // Optional task to edit
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSave,
  editTask,
}) => {
  const { theme } = useTheme();
  const { locale } = useLocale(); // This will trigger re-render on language change
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [energy, setEnergy] = useState<EnergyLevel>('high');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('other');
  const [estimatedDuration, setEstimatedDuration] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<TaskSuggestion | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Load task data when editing
  useEffect(() => {
    if (editTask && visible) {
      setTitle(editTask.title);
      setNote(editTask.note || '');
      setEnergy(editTask.energy);
      setPriority(editTask.priority);
      setCategory(editTask.category);
      setEstimatedDuration(editTask.estimatedDuration || '');
      
      // Load scheduled date/time
      if (editTask.scheduledDate) {
        setScheduledDate(new Date(editTask.scheduledDate));
      }
      if (editTask.scheduledTime) {
        const [hours, minutes] = editTask.scheduledTime.split(':');
        const time = new Date();
        time.setHours(parseInt(hours), parseInt(minutes));
        setScheduledTime(time);
      }
    } else if (!visible) {
      // Reset when closing
      setTitle('');
      setNote('');
      setEnergy('high');
      setPriority('medium');
      setCategory('other');
      setEstimatedDuration('');
      setScheduledDate(null);
      setScheduledTime(null);
      setAiSuggestion(null);
    }
  }, [editTask, visible]);

  const handleGetAISuggestions = async () => {
    if (!title.trim()) return;
    
    setIsLoadingAI(true);
    hapticFeedback.light();
    
    try {
      const suggestion = await getTaskSuggestions(title);
      if (suggestion) {
        setAiSuggestion(suggestion);
        hapticFeedback.success();
      }
    } catch (error) {
      console.error('AI suggestion error:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleApplySuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion.category);
      setPriority(aiSuggestion.priority);
      setEnergy(aiSuggestion.energy);
      if (aiSuggestion.estimatedDuration) {
        setEstimatedDuration(aiSuggestion.estimatedDuration);
      }
      // Add AI tip to notes with lightbulb emoji
      if (aiSuggestion.tips) {
        const tipText = `💡 ${aiSuggestion.tips}`;
        setNote(note ? `${note}\n\n${tipText}` : tipText);
      }
      hapticFeedback.selection();
    }
  };

  const handleApplyScheduleSuggestion = () => {
    if (aiSuggestion && (aiSuggestion.scheduledDate || aiSuggestion.scheduledTime)) {
      // Apply suggested date
      if (aiSuggestion.scheduledDate) {
        const today = new Date();
        let suggestedDate = new Date();
        
        switch (aiSuggestion.scheduledDate) {
          case 'today':
            suggestedDate = today;
            break;
          case 'tomorrow':
            suggestedDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            break;
          case 'weekend':
            // Find next Saturday
            const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
            suggestedDate = new Date(today.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
            break;
          case 'next_week':
            // Next Monday
            const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
            suggestedDate = new Date(today.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000);
            break;
        }
        setScheduledDate(suggestedDate);
      }
      
      // Apply suggested time
      if (aiSuggestion.scheduledTime) {
        const [hours, minutes] = aiSuggestion.scheduledTime.split(':').map(Number);
        const timeDate = new Date();
        timeDate.setHours(hours, minutes, 0, 0);
        setScheduledTime(timeDate);
      }
      
      hapticFeedback.success();
    }
  };

  const handleSave = () => {
    if (title.trim()) {
      // Prepare scheduled date (start of day timestamp)
      const scheduledDateTimestamp = scheduledDate 
        ? new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate()).getTime()
        : undefined;
      
      // Prepare scheduled time (HH:MM format)
      const scheduledTimeString = scheduledTime
        ? `${scheduledTime.getHours().toString().padStart(2, '0')}:${scheduledTime.getMinutes().toString().padStart(2, '0')}`
        : undefined;

      onSave(
        title.trim(), 
        note.trim(), 
        energy, 
        priority, 
        category,
        estimatedDuration || undefined,
        scheduledDateTimestamp,
        scheduledTimeString
      );
      setTitle('');
      setNote('');
      setEnergy('high');
      setPriority('medium');
      setCategory('other');
      setEstimatedDuration('');
      setScheduledDate(null);
      setScheduledTime(null);
      setAiSuggestion(null);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setNote('');
    setEnergy('high');
    setPriority('medium');
    setCategory('other');
    setEstimatedDuration('');
    setScheduledDate(null);
    setScheduledTime(null);
    setAiSuggestion(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editTask ? translate('editTask') : translate('addTask')}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {translate('taskTitle')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  setAiSuggestion(null); // Clear suggestion when editing
                }}
                placeholder={translate('taskTitle')}
                placeholderTextColor={theme.textSecondary}
                autoFocus
              />
              
              {/* AI Suggestion Button */}
              {title.trim().length > 3 && !aiSuggestion && (
                <TouchableOpacity
                  style={[styles.aiButton, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}
                  onPress={handleGetAISuggestions}
                  disabled={isLoadingAI}
                >
                  {isLoadingAI ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                  ) : (
                    <>
                      <Ionicons name="sparkles" size={18} color={theme.primary} />
                      <Text style={[styles.aiButtonText, { color: theme.primary }]}>
                        {translate('ai.getSuggestions')}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {/* AI Suggestion Card */}
              {aiSuggestion && (
                <View style={[styles.suggestionCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
                  <View style={styles.suggestionHeader}>
                    <Ionicons name="sparkles" size={20} color={theme.primary} />
                    <Text style={[styles.suggestionTitle, { color: theme.text }]}>
                      {translate('ai.suggestions')}
                    </Text>
                    <TouchableOpacity onPress={() => setAiSuggestion(null)}>
                      <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.suggestionContent}>
                    <View style={styles.suggestionRow}>
                      <Text style={[styles.suggestionLabel, { color: theme.textSecondary }]}>
                        {getCategoryIcon(aiSuggestion.category)} {translate('ai.category')}:
                      </Text>
                      <Text style={[styles.suggestionValue, { color: theme.text }]}>
                        {translate(`categories.${aiSuggestion.category}`)}
                      </Text>
                    </View>
                    
                    <View style={styles.suggestionRow}>
                      <Text style={[styles.suggestionLabel, { color: theme.textSecondary }]}>
                        🎯 {translate('ai.priority')}:
                      </Text>
                      <Text style={[styles.suggestionValue, { color: theme.text }]}>
                        {translate(`priority.${aiSuggestion.priority}`)}
                      </Text>
                    </View>
                    
                    <View style={styles.suggestionRow}>
                      <Text style={[styles.suggestionLabel, { color: theme.textSecondary }]}>
                        ⚡ {translate('ai.energy')}:
                      </Text>
                      <Text style={[styles.suggestionValue, { color: theme.text }]}>
                        {aiSuggestion.energy === 'high' ? translate('highEnergy') : translate('lowEnergy')}
                      </Text>
                    </View>

                    {aiSuggestion.estimatedDuration && (
                      <View style={styles.suggestionRow}>
                        <Text style={[styles.suggestionLabel, { color: theme.textSecondary }]}>
                          ⏱️ {translate('ai.duration')}:
                        </Text>
                        <Text style={[styles.suggestionValue, { color: theme.text }]}>
                          {aiSuggestion.estimatedDuration}
                        </Text>
                      </View>
                    )}

                    {aiSuggestion.tips && (
                      <View style={[styles.tipBox, { backgroundColor: theme.primary + '10' }]}>
                        <Text style={[styles.tipText, { color: theme.text }]}>
                          💡 {aiSuggestion.tips}
                        </Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.applySuggestionButton, { backgroundColor: theme.primary }]}
                    onPress={handleApplySuggestion}
                  >
                    <Text style={styles.applySuggestionText}>
                      {translate('ai.applySuggestions')}
                    </Text>
                  </TouchableOpacity>

                  {/* AI Schedule Suggestion */}
                  {(aiSuggestion.scheduledDate || aiSuggestion.scheduledTime) && (
                    <View style={[styles.scheduleRecommendation, { backgroundColor: theme.success + '10', borderColor: theme.success }]}>
                      <View style={styles.scheduleRecommendationHeader}>
                        <Ionicons name="calendar-outline" size={18} color={theme.success} />
                        <Text style={[styles.scheduleRecommendationTitle, { color: theme.success }]}>
                          {translate('ai.scheduleRecommendation')}
                        </Text>
                      </View>
                      
                      {aiSuggestion.scheduledDate && (
                        <View style={styles.scheduleRecommendationRow}>
                          <Text style={[styles.scheduleRecommendationLabel, { color: theme.textSecondary }]}>
                            📅 {translate('scheduledDate')}:
                          </Text>
                          <Text style={[styles.scheduleRecommendationValue, { color: theme.text }]}>
                            {aiSuggestion.scheduledDate === 'today' && translate('scheduled.today')}
                            {aiSuggestion.scheduledDate === 'tomorrow' && (i18n.locale === 'tr' ? 'Yarın' : 'Tomorrow')}
                            {aiSuggestion.scheduledDate === 'weekend' && (i18n.locale === 'tr' ? 'Hafta Sonu' : 'Weekend')}
                            {aiSuggestion.scheduledDate === 'next_week' && (i18n.locale === 'tr' ? 'Gelecek Hafta' : 'Next Week')}
                          </Text>
                        </View>
                      )}
                      
                      {aiSuggestion.scheduledTime && (
                        <View style={styles.scheduleRecommendationRow}>
                          <Text style={[styles.scheduleRecommendationLabel, { color: theme.textSecondary }]}>
                            ⏰ {translate('scheduledTime')}:
                          </Text>
                          <Text style={[styles.scheduleRecommendationValue, { color: theme.text }]}>
                            {aiSuggestion.scheduledTime}
                          </Text>
                        </View>
                      )}
                      
                      {aiSuggestion.scheduleReason && (
                        <Text style={[styles.scheduleReason, { color: theme.textSecondary }]}>
                          {aiSuggestion.scheduleReason}
                        </Text>
                      )}
                      
                      <TouchableOpacity
                        style={[styles.applyScheduleButton, { backgroundColor: theme.success }]}
                        onPress={handleApplyScheduleSuggestion}
                      >
                        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                        <Text style={styles.applyScheduleText}>
                          {translate('ai.applySchedule')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {translate('taskNote')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={note}
                onChangeText={setNote}
                placeholder={translate('taskNote')}
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                ⏱️ {translate('taskDuration')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={estimatedDuration}
                onChangeText={setEstimatedDuration}
                placeholder="15 dk, 30 dk, 1 saat..."
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* Schedule Section */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                📅 {translate('scheduleTask')}
              </Text>
              
              <View style={styles.scheduleRow}>
                {/* Date Picker Button */}
                <TouchableOpacity
                  style={[styles.scheduleButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                  <Text style={[styles.scheduleButtonText, { color: theme.text }]}>
                    {scheduledDate 
                      ? scheduledDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
                      : translate('selectDate')
                    }
                  </Text>
                  {scheduledDate && (
                    <TouchableOpacity onPress={() => setScheduledDate(null)}>
                      <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>

                {/* Time Picker Button */}
                <TouchableOpacity
                  style={[styles.scheduleButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color={theme.primary} />
                  <Text style={[styles.scheduleButtonText, { color: theme.text }]}>
                    {scheduledTime 
                      ? `${scheduledTime.getHours().toString().padStart(2, '0')}:${scheduledTime.getMinutes().toString().padStart(2, '0')}`
                      : translate('selectTime')
                    }
                  </Text>
                  {scheduledTime && (
                    <TouchableOpacity onPress={() => setScheduledTime(null)}>
                      <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>

              {/* Date Picker Modal */}
              {showDatePicker && (
                <DateTimePicker
                  value={scheduledDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setScheduledDate(selectedDate);
                      hapticFeedback.light();
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}

              {/* Time Picker Modal */}
              {showTimePicker && (
                <DateTimePicker
                  value={scheduledTime || new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      setScheduledTime(selectedTime);
                      hapticFeedback.light();
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {translate('energyLevel')}
              </Text>
              <View style={styles.energyOptions}>
                <TouchableOpacity
                  style={[
                    styles.energyButton,
                    {
                      backgroundColor:
                        energy === 'high' ? theme.highEnergy : theme.surface,
                      borderColor: energy === 'high' ? theme.highEnergy : theme.border,
                    },
                  ]}
                  onPress={() => setEnergy('high')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.energyEmoji}>{translate('highEnergyIcon')}</Text>
                  <Text
                    style={[
                      styles.energyText,
                      {
                        color: energy === 'high' ? '#000' : theme.text,
                      },
                    ]}
                  >
                    {translate('highEnergy')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.energyButton,
                    {
                      backgroundColor:
                        energy === 'low' ? theme.lowEnergy : theme.surface,
                      borderColor: energy === 'low' ? theme.lowEnergy : theme.border,
                    },
                  ]}
                  onPress={() => setEnergy('low')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.energyEmoji}>{translate('lowEnergyIcon')}</Text>
                  <Text
                    style={[
                      styles.energyText,
                      {
                        color: energy === 'low' ? '#000' : theme.text,
                      },
                    ]}
                  >
                    {translate('lowEnergy')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {translate('categories.work')} / {translate('categories.other')}
              </Text>
              <View style={styles.categoryGrid}>
                {(['work', 'personal', 'health', 'shopping', 'other'] as Category[]).map(
                  (cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor:
                            category === cat ? getCategoryColor(cat) + '30' : theme.surface,
                          borderColor:
                            category === cat ? getCategoryColor(cat) : theme.border,
                        },
                      ]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryEmoji}>{getCategoryIcon(cat)}</Text>
                      <Text
                        style={[
                          styles.categoryText,
                          { color: category === cat ? theme.text : theme.textSecondary },
                        ]}
                      >
                        {translate(`categories.${cat}`)}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Priority Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {translate('priority.label')}
              </Text>
              <View style={styles.priorityOptions}>
                {(['low', 'medium', 'high'] as Priority[]).map((prior) => (
                  <TouchableOpacity
                    key={prior}
                    style={[
                      styles.priorityButton,
                      {
                        backgroundColor:
                          priority === prior
                            ? getPriorityColor(prior) + '20'
                            : theme.surface,
                        borderColor:
                          priority === prior ? getPriorityColor(prior) : theme.border,
                      },
                    ]}
                    onPress={() => setPriority(prior)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(prior) },
                      ]}
                    />
                    <Text
                      style={[
                        styles.priorityText,
                        { color: priority === prior ? theme.text : theme.textSecondary },
                      ]}
                    >
                      {translate(`priority.${prior}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                {translate('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                { backgroundColor: theme.primary },
                !title.trim() && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={!title.trim()}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {translate('save')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  energyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  energyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  energyEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  energyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    borderWidth: 0,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 12,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  suggestionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  suggestionContent: {
    gap: 10,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionLabel: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 100,
  },
  suggestionValue: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  tipBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
  },
  applySuggestionButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  applySuggestionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleRecommendation: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  scheduleRecommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scheduleRecommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scheduleRecommendationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleRecommendationLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  scheduleRecommendationValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  scheduleReason: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 4,
  },
  applyScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  applyScheduleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
