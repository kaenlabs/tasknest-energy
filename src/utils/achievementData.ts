import { AchievementId, Achievement } from '../types/achievement.types';

export const ACHIEVEMENT_DEFINITIONS: Record<
  AchievementId,
  Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>
> = {
  first_task: {
    id: 'first_task',
    titleKey: 'achievements.firstTask.title',
    descriptionKey: 'achievements.firstTask.description',
    icon: '🎯',
    color: '#4CAF50',
    target: 1,
  },
  task_master_10: {
    id: 'task_master_10',
    titleKey: 'achievements.taskMaster10.title',
    descriptionKey: 'achievements.taskMaster10.description',
    icon: '⭐',
    color: '#FF9800',
    target: 10,
  },
  task_master_50: {
    id: 'task_master_50',
    titleKey: 'achievements.taskMaster50.title',
    descriptionKey: 'achievements.taskMaster50.description',
    icon: '🌟',
    color: '#FF6B6B',
    target: 50,
  },
  task_master_100: {
    id: 'task_master_100',
    titleKey: 'achievements.taskMaster100.title',
    descriptionKey: 'achievements.taskMaster100.description',
    icon: '💎',
    color: '#9C27B0',
    target: 100,
  },
  streak_3: {
    id: 'streak_3',
    titleKey: 'achievements.streak3.title',
    descriptionKey: 'achievements.streak3.description',
    icon: '🔥',
    color: '#FF5722',
    target: 3,
  },
  streak_7: {
    id: 'streak_7',
    titleKey: 'achievements.streak7.title',
    descriptionKey: 'achievements.streak7.description',
    icon: '🚀',
    color: '#E91E63',
    target: 7,
  },
  streak_30: {
    id: 'streak_30',
    titleKey: 'achievements.streak30.title',
    descriptionKey: 'achievements.streak30.description',
    icon: '👑',
    color: '#FFD700',
    target: 30,
  },
  week_warrior: {
    id: 'week_warrior',
    titleKey: 'achievements.weekWarrior.title',
    descriptionKey: 'achievements.weekWarrior.description',
    icon: '💪',
    color: '#2196F3',
    target: 7,
  },
  category_master: {
    id: 'category_master',
    titleKey: 'achievements.categoryMaster.title',
    descriptionKey: 'achievements.categoryMaster.description',
    icon: '🎨',
    color: '#00BCD4',
    target: 5,
  },
  priority_pro: {
    id: 'priority_pro',
    titleKey: 'achievements.priorityPro.title',
    descriptionKey: 'achievements.priorityPro.description',
    icon: '🏆',
    color: '#FFC107',
    target: 10,
  },
  early_bird: {
    id: 'early_bird',
    titleKey: 'achievements.earlyBird.title',
    descriptionKey: 'achievements.earlyBird.description',
    icon: '🌅',
    color: '#FF9800',
    target: 5,
  },
  night_owl: {
    id: 'night_owl',
    titleKey: 'achievements.nightOwl.title',
    descriptionKey: 'achievements.nightOwl.description',
    icon: '🦉',
    color: '#673AB7',
    target: 5,
  },
};

export const getInitialAchievements = (): Achievement[] => {
  return Object.values(ACHIEVEMENT_DEFINITIONS).map((def) => ({
    ...def,
    progress: 0,
    unlocked: false,
  }));
};
