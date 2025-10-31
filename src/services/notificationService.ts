import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task.types';

const NOTIFICATION_SETTINGS_KEY = '@TaskNest:notification_settings';

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  dailyReminder: boolean;
  dailyReminderTime: { hour: number; minute: number };
  streakReminder: boolean;
  achievementNotifications: boolean;
  overdueReminders: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  taskReminders: true,
  dailyReminder: true,
  dailyReminderTime: { hour: 9, minute: 0 }, // 9:00 AM
  streakReminder: true,
  achievementNotifications: true,
  overdueReminders: true,
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }
    
    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B9D',
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Get notification settings
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading notification settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save notification settings
 */
export const saveNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

/**
 * Schedule notification for a task
 */
export const scheduleTaskNotification = async (task: Task): Promise<string | null> => {
  try {
    console.log('🔔 Attempting to schedule notification for task:', task.title);
    
    const settings = await getNotificationSettings();
    console.log('⚙️ Notification settings:', settings);
    
    if (!settings.enabled || !settings.taskReminders) {
      console.log('❌ Notifications disabled in settings');
      return null;
    }
    
    if (!task.scheduledDate || !task.scheduledTime) {
      console.log('❌ Task has no date/time');
      return null;
    }
    
    // Parse scheduled time
    const [hours, minutes] = task.scheduledTime.split(':').map(Number);
    const scheduledDateTime = new Date(task.scheduledDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    
    console.log('📅 Scheduled for:', scheduledDateTime.toLocaleString('tr-TR'));
    console.log('🕐 Current time:', new Date().toLocaleString('tr-TR'));
    
    // Schedule notification 5 minutes before
    const notificationTime = new Date(scheduledDateTime.getTime() - 5 * 60 * 1000);
    console.log('⏰ Notification will be sent at:', notificationTime.toLocaleString('tr-TR'));
    
    // Don't schedule if notification time has passed
    if (notificationTime.getTime() <= Date.now()) {
      console.log('❌ Notification time has already passed (less than 5 minutes until task)');
      return null;
    }
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Görev Hatırlatma',
        body: `"${task.title}" görevi 5 dakika sonra başlayacak!`,
        data: { taskId: task.id, type: 'task_reminder' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationTime,
      },
    });
    
    console.log('✅ Notification scheduled with ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('❌ Error scheduling task notification:', error);
    return null;
  }
};

/**
 * Cancel a scheduled notification
 */
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

/**
 * Schedule daily reminder with task information
 */
export const scheduleDailyReminder = async (todayTasks: any[]): Promise<void> => {
  try {
    const settings = await getNotificationSettings();
    if (!settings.enabled || !settings.dailyReminder) {
      return;
    }
    
    // Cancel existing daily reminders
    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of allScheduled) {
      if (notification.content.data?.type === 'daily_reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    
    const { hour, minute } = settings.dailyReminderTime;
    
    // Filter scheduled tasks for today
    const scheduledTasks = todayTasks.filter(t => t.scheduledDate && t.scheduledTime && !t.completed);
    
    let message = '👋 Günaydın! Bugün için planlanmış görevin yok.';
    
    if (scheduledTasks.length > 0) {
      // Sort by time to find nearest task
      const sortedTasks = [...scheduledTasks].sort((a, b) => {
        const timeA = a.scheduledTime.split(':').map(Number);
        const timeB = b.scheduledTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
      
      const nearestTask = sortedTasks[0];
      const taskCount = scheduledTasks.length;
      
      if (taskCount === 1) {
        message = `👋 Günaydın! Bugün 1 görevin var.\n⏰ İlk görev: ${nearestTask.scheduledTime} - ${nearestTask.title}`;
      } else {
        message = `👋 Günaydın! Bugün ${taskCount} görevin var.\n⏰ İlk görev: ${nearestTask.scheduledTime} - ${nearestTask.title}`;
      }
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🪺 TaskNest',
        body: message,
        data: { type: 'daily_reminder' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });
    
    console.log('📅 Daily reminder updated:', {
      taskCount: scheduledTasks.length,
      time: `${hour}:${minute}`,
    });
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
  }
};

/**
 * Send streak reminder (evening)
 */
export const scheduleStreakReminder = async (hasCompletedToday: boolean): Promise<void> => {
  try {
    const settings = await getNotificationSettings();
    if (!settings.enabled || !settings.streakReminder || hasCompletedToday) {
      return;
    }
    
    // Schedule for 8 PM if no tasks completed today
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(20, 0, 0, 0);
    
    // Only schedule if time hasn't passed today
    if (reminderTime.getTime() > now.getTime()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 Streak Uyarısı',
          body: 'Bugün henüz görev tamamlamadın! Serisini kaybetme!',
          data: { type: 'streak_reminder' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderTime,
        },
      });
    }
  } catch (error) {
    console.error('Error scheduling streak reminder:', error);
  }
};

/**
 * Send achievement notification
 */
export const sendAchievementNotification = async (
  achievementTitle: string,
  achievementDescription: string
): Promise<void> => {
  try {
    const settings = await getNotificationSettings();
    if (!settings.enabled || !settings.achievementNotifications) {
      return;
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Başarım Kilidi Açıldı!',
        body: `${achievementTitle}: ${achievementDescription}`,
        data: { type: 'achievement_unlocked' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending achievement notification:', error);
  }
};

/**
 * Send task completion notification
 */
export const sendTaskCompletionNotification = async (taskTitle: string): Promise<void> => {
  try {
    const settings = await getNotificationSettings();
    if (!settings.enabled) {
      return;
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Görev Tamamlandı!',
        body: `"${taskTitle}" görevi başarıyla tamamlandı!`,
        data: { type: 'task_completed' },
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending task completion notification:', error);
  }
};

/**
 * Send overdue task notification
 */
export const sendOverdueNotification = async (task: Task): Promise<void> => {
  try {
    const settings = await getNotificationSettings();
    if (!settings.enabled || !settings.overdueReminders) {
      return;
    }
    
    // Calculate how long overdue
    let timeText = '';
    if (task.scheduledDate && task.scheduledTime) {
      const [hours, minutes] = task.scheduledTime.split(':').map(Number);
      const scheduledDateTime = new Date(task.scheduledDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);
      
      const now = Date.now();
      const overdueDuration = now - scheduledDateTime.getTime();
      const overdueHours = Math.floor(overdueDuration / (1000 * 60 * 60));
      const overdueMinutes = Math.floor((overdueDuration % (1000 * 60 * 60)) / (1000 * 60));
      
      if (overdueHours > 0) {
        timeText = ` (${overdueHours} saat gecikmiş)`;
      } else if (overdueMinutes > 0) {
        timeText = ` (${overdueMinutes} dakika gecikmiş)`;
      }
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Görev Gecikti!',
        body: `"${task.title}" görevi zamanında tamamlanmadı${timeText}`,
        data: { taskId: task.id, type: 'task_overdue' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Send immediately
    });
    
    console.log('📲 Overdue notification sent for:', task.title);
  } catch (error) {
    console.error('Error sending overdue notification:', error);
  }
};

/**
 * Get scheduled notifications
 */
export const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Debug helper: Log all scheduled notifications
 */
export const debugScheduledNotifications = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('\n📋 ===== SCHEDULED NOTIFICATIONS =====');
    console.log('Total count:', scheduled.length);
    
    if (scheduled.length === 0) {
      console.log('No scheduled notifications found.');
      return;
    }
    
    scheduled.forEach((notification, index) => {
      console.log(`\n${index + 1}. ID: ${notification.identifier}`);
      console.log(`   Title: ${notification.content.title}`);
      console.log(`   Body: ${notification.content.body}`);
      
      if (notification.trigger && 'date' in notification.trigger && notification.trigger.date) {
        const triggerDate = new Date(notification.trigger.date);
        console.log(`   Scheduled for: ${triggerDate.toLocaleString('tr-TR')}`);
        console.log(`   Time until: ${Math.round((triggerDate.getTime() - Date.now()) / 60000)} minutes`);
      } else if (notification.trigger && 'type' in notification.trigger) {
        console.log(`   Trigger type: ${notification.trigger.type}`);
      }
    });
    console.log('===================================\n');
  } catch (error) {
    console.error('Error debugging scheduled notifications:', error);
  }
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

/**
 * Initialize notifications
 */
export const initializeNotifications = async (): Promise<boolean> => {
  const hasPermission = await requestNotificationPermissions();
  if (hasPermission) {
    const settings = await getNotificationSettings();
    if (settings.enabled) {
      // Schedule daily reminder for next morning
      await scheduleDailyReminder([]); // Will be updated with actual tasks from context
    }
  }
  return hasPermission;
};
