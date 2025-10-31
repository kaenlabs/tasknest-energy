import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EnergyLevel, Priority, Category } from '../types/task.types';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { translate } from '../locales/i18n';
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
    category: Category
  ) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const { locale } = useLocale(); // This will trigger re-render on language change
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [energy, setEnergy] = useState<EnergyLevel>('high');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('other');

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), note.trim(), energy, priority, category);
      setTitle('');
      setNote('');
      setEnergy('high');
      setPriority('medium');
      setCategory('other');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setNote('');
    setEnergy('high');
    setPriority('medium');
    setCategory('other');
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
              {translate('addTask')}
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
                onChangeText={setTitle}
                placeholder={translate('taskTitle')}
                placeholderTextColor={theme.textSecondary}
                autoFocus
              />
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
});
