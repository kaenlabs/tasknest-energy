import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTaskContext } from '../context/TaskContext';
import { translate } from '../locales/i18n';
import { hapticFeedback } from '../utils/haptics';
import {
  NotificationSettings,
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermissions,
  scheduleDailyReminder,
  cancelAllNotifications,
  debugScheduledNotifications,
} from '../services/notificationService';

export const NotificationSettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { tasks } = useTaskContext();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    taskReminders: true,
    dailyReminder: true,
    dailyReminderTime: { hour: 9, minute: 0 },
    streakReminder: true,
    achievementNotifications: true,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, []);

  const loadSettings = async () => {
    const loaded = await getNotificationSettings();
    setSettings(loaded);
  };

  const checkPermissions = async () => {
    const granted = await requestNotificationPermissions();
    setHasPermission(granted);
  };

  const handleToggle = async (key: keyof NotificationSettings) => {
    hapticFeedback.selection();
    
    if (key === 'enabled' && !settings.enabled && !hasPermission) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'İzin Gerekli',
          'Bildirimleri kullanmak için lütfen ayarlardan izin verin.',
          [{ text: 'Tamam' }]
        );
        return;
      }
      setHasPermission(true);
    }
    
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await saveNotificationSettings(newSettings);
    
    // If disabling all notifications, cancel scheduled ones
    if (key === 'enabled' && settings.enabled) {
      await cancelAllNotifications();
    }
    
    // If enabling daily reminder, schedule it with current tasks
    if (key === 'dailyReminder' && !settings.dailyReminder) {
      const today = new Date();
      const todayTasks = tasks.filter((t: any) => {
        if (!t.scheduledDate) return false;
        const taskDate = new Date(t.scheduledDate);
        return taskDate.toDateString() === today.toDateString();
      });
      await scheduleDailyReminder(todayTasks);
    }
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      hapticFeedback.light();
      const hour = selectedDate.getHours();
      const minute = selectedDate.getMinutes();
      
      const newSettings = {
        ...settings,
        dailyReminderTime: { hour, minute },
      };
      setSettings(newSettings);
      await saveNotificationSettings(newSettings);
      
      if (settings.dailyReminder) {
        const today = new Date();
        const todayTasks = tasks.filter((t: any) => {
          if (!t.scheduledDate) return false;
          const taskDate = new Date(t.scheduledDate);
          return taskDate.toDateString() === today.toDateString();
        });
        await scheduleDailyReminder(todayTasks);
      }
    }
  };

  const getTimeDisplay = () => {
    const { hour, minute } = settings.dailyReminderTime;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getTimeDate = () => {
    const date = new Date();
    date.setHours(settings.dailyReminderTime.hour);
    date.setMinutes(settings.dailyReminderTime.minute);
    return date;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="notifications" size={48} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text }]}>
          Bildirim Ayarları
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Hatırlatıcılarını özelleştir
        </Text>
      </View>

      {/* Main Toggle */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>
              🔔 Bildirimleri Aç
            </Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Tüm bildirimleri etkinleştir
            </Text>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={() => handleToggle('enabled')}
            trackColor={{ false: theme.border, true: theme.primary + '40' }}
            thumbColor={settings.enabled ? theme.primary : theme.textSecondary}
          />
        </View>
      </View>

      {/* Task Reminders */}
      {settings.enabled && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            GÖREV HATIRLATICILARı
          </Text>

          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  ⏰ Zamanlanmış Görevler
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Görev saati yaklaştığında bildirim
                </Text>
              </View>
              <Switch
                value={settings.taskReminders}
                onValueChange={() => handleToggle('taskReminders')}
                trackColor={{ false: theme.border, true: theme.primary + '40' }}
                thumbColor={settings.taskReminders ? theme.primary : theme.textSecondary}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  🌅 Günlük Hatırlatma
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Her sabah günlük görevlerin için hatırlatma
                </Text>
              </View>
              <Switch
                value={settings.dailyReminder}
                onValueChange={() => handleToggle('dailyReminder')}
                trackColor={{ false: theme.border, true: theme.primary + '40' }}
                thumbColor={settings.dailyReminder ? theme.primary : theme.textSecondary}
              />
            </View>

            {settings.dailyReminder && (
              <TouchableOpacity
                style={[styles.timeButton, { backgroundColor: theme.background }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={theme.primary} />
                <Text style={[styles.timeText, { color: theme.text }]}>
                  {getTimeDisplay()}
                </Text>
              </TouchableOpacity>
            )}

            {showTimePicker && (
              <DateTimePicker
                value={getTimeDate()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Motivation */}
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            MOTİVASYON
          </Text>

          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  🔥 Streak Uyarısı
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Günlük görev tamamlamadıysan akşam hatırlatma
                </Text>
              </View>
              <Switch
                value={settings.streakReminder}
                onValueChange={() => handleToggle('streakReminder')}
                trackColor={{ false: theme.border, true: theme.primary + '40' }}
                thumbColor={settings.streakReminder ? theme.primary : theme.textSecondary}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  🏆 Başarım Bildirimleri
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Yeni başarım kilidini açtığında bildirim
                </Text>
              </View>
              <Switch
                value={settings.achievementNotifications}
                onValueChange={() => handleToggle('achievementNotifications')}
                trackColor={{ false: theme.border, true: theme.primary + '40' }}
                thumbColor={settings.achievementNotifications ? theme.primary : theme.textSecondary}
              />
            </View>
          </View>

          {/* Info */}
          <View style={[styles.infoCard, { backgroundColor: theme.primary + '10' }]}>
            <Ionicons name="information-circle" size={24} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.text }]}>
              Görev hatırlatıcıları zamanlanmış görevlerin 5 dakika öncesinde gönderilir.
            </Text>
          </View>
        </>
      )}

      {!hasPermission && (
        <View style={[styles.warningCard, { backgroundColor: '#EF4444' + '20' }]}>
          <Ionicons name="alert-circle" size={24} color="#EF4444" />
          <Text style={[styles.warningText, { color: '#EF4444' }]}>
            Bildirim izni verilmemiş. Ayarlardan bildirimleri açabilirsiniz.
          </Text>
        </View>
      )}

      {/* Debug Button */}
      <TouchableOpacity
        style={[styles.debugButton, { backgroundColor: theme.primary }]}
        onPress={async () => {
          hapticFeedback.light();
          await debugScheduledNotifications();
          Alert.alert('Bilgi', 'Zamanlanmış bildirimler konsol loglarında gösterildi.');
        }}
      >
        <Ionicons name="bug" size={20} color="white" />
        <Text style={styles.debugButtonText}>
          Zamanlanmış Bildirimleri Göster (Debug)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
