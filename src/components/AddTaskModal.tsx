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
import { EnergyLevel } from '../types/task.types';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../locales/i18n';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, note: string, energy: EnergyLevel) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [energy, setEnergy] = useState<EnergyLevel>('high');

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), note.trim(), energy);
      setTitle('');
      setNote('');
      setEnergy('high');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setNote('');
    setEnergy('high');
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
