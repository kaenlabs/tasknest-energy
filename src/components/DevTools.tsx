import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const DevTools: React.FC = () => {
  const { theme } = useTheme();

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@TaskNest:onboarding_completed');
      Alert.alert('Success', 'Onboarding reset! Restart the app to see it again.');
    } catch (error) {
      Alert.alert('Error', 'Could not reset onboarding');
    }
  };

  const clearTutorial = async () => {
    try {
      await AsyncStorage.removeItem('@TaskNest:tutorial_completed');
      Alert.alert('Success', 'Tutorial reset! Restart the app to see it again.');
    } catch (error) {
      Alert.alert('Error', 'Could not reset tutorial');
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data?',
      'This will delete all tasks and reset the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data cleared! Restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Could not clear data');
            }
          },
        },
      ]
    );
  };

  // Only show in development
  if (__DEV__) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={clearOnboarding}
        >
          <Ionicons name="refresh" size={16} color="#fff" />
          <Text style={styles.buttonText}>Reset Onboarding</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FCD34D' }]}
          onPress={clearTutorial}
        >
          <Ionicons name="help-circle" size={16} color="#000" />
          <Text style={[styles.buttonText, { color: '#000' }]}>Reset Tutorial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#EF4444' }]}
          onPress={clearAllData}
        >
          <Ionicons name="trash" size={16} color="#fff" />
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
