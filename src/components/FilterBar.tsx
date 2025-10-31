import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { TaskFilter } from '../types/task.types';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../locales/i18n';

interface FilterBarProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const { theme } = useTheme();

  const filters: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: translate('allTasks') },
    { key: 'high', label: translate('highEnergyTasks') },
    { key: 'low', label: translate('lowEnergyTasks') },
    { key: 'completed', label: translate('completedTasks') },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterButton,
            {
              backgroundColor:
                activeFilter === filter.key ? theme.primary : theme.surface,
              borderColor: activeFilter === filter.key ? theme.primary : theme.border,
            },
          ]}
          onPress={() => onFilterChange(filter.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: activeFilter === filter.key ? '#fff' : theme.text,
              },
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
