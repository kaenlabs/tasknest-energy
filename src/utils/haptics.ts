import * as Haptics from 'expo-haptics';

/**
 * Haptic feedback utility functions
 * Provides tactile feedback for user interactions
 */

export const hapticFeedback = {
  /**
   * Light impact - for subtle actions like button presses
   */
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptics not supported on device
      console.log('Haptics not supported');
    }
  },

  /**
   * Medium impact - for standard actions like task completion
   */
  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Haptics not supported');
    }
  },

  /**
   * Heavy impact - for important actions
   */
  heavy: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.log('Haptics not supported');
    }
  },

  /**
   * Success notification - for achievements, completions
   */
  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Haptics not supported');
    }
  },

  /**
   * Warning notification - for delete actions
   */
  warning: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.log('Haptics not supported');
    }
  },

  /**
   * Error notification - for failed actions
   */
  error: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.log('Haptics not supported');
    }
  },

  /**
   * Selection feedback - for switches, pickers, tab changes
   */
  selection: async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.log('Haptics not supported');
    }
  },
};
