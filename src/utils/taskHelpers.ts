import { Category, Priority } from '../types/task.types';

export const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    work: '💼',
    personal: '🏠',
    health: '❤️',
    shopping: '🛒',
    other: '📝',
  };
  return icons[category];
};

export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    work: '#60A5FA',
    personal: '#A78BFA',
    health: '#F87171',
    shopping: '#FCD34D',
    other: '#9CA3AF',
  };
  return colors[category];
};

export const getPriorityColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
  };
  return colors[priority];
};

export const getPriorityLabel = (priority: Priority): string => {
  const labels: Record<Priority, string> = {
    high: '!!!',
    medium: '!!',
    low: '!',
  };
  return labels[priority];
};
