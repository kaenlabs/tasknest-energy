import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { translate } from '../locales/i18n';

export const EmptyState: React.FC = () => {
  const { theme } = useTheme();
  const { locale } = useLocale(); // This will trigger re-render on language change

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-done-circle-outline" size={80} color={theme.primary} />
      <Text style={[styles.title, { color: theme.text }]}>
        {translate('noTasks')}
      </Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {translate('noTasksDescription')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
