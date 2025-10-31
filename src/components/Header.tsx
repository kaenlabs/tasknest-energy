import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { hapticFeedback } from '../utils/haptics';
import { translate } from '../locales/i18n';
import { getTimeOfDay } from '../utils/timeUtils';

export const Header: React.FC = () => {
  const { theme, toggleTheme, colorScheme } = useTheme();
  const { locale, changeLocale } = useLocale();

  const timeOfDay = getTimeOfDay();
  const timeOfDayTips = {
    morning: 'morningTip',
    afternoon: 'afternoonTip',
    evening: 'eveningTip',
  };

  const handleLanguageToggle = () => {
    hapticFeedback.selection();
    changeLocale(locale === 'tr' ? 'en' : 'tr');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          {translate('todaysTasks')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {translate(timeOfDayTips[timeOfDay])}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.surface }]}
          onPress={handleLanguageToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.languageText}>{locale === 'tr' ? '🇹🇷' : '🇬🇧'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.surface }]}
          onPress={() => {
            hapticFeedback.selection();
            toggleTheme();
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={colorScheme === 'light' ? 'moon' : 'sunny'}
            size={22}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageText: {
    fontSize: 22,
  },
});
