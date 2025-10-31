export type AchievementId =
  | 'first_task'
  | 'task_master_10'
  | 'task_master_50'
  | 'task_master_100'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'week_warrior'
  | 'category_master'
  | 'priority_pro'
  | 'early_bird'
  | 'night_owl';

export interface Achievement {
  id: AchievementId;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  target: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string; // YYYY-MM-DD format
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  bestDay: string;
  achievementsEarned: AchievementId[];
  motivationalMessage: string;
}
