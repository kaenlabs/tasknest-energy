import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, StreakData, AchievementId } from '../types/achievement.types';
import { getInitialAchievements } from '../utils/achievementData';

const ACHIEVEMENTS_KEY = '@TaskNest:achievements';
const STREAK_KEY = '@TaskNest:streak';

interface AchievementContextType {
  achievements: Achievement[];
  streak: StreakData;
  checkAndUnlockAchievements: (totalCompleted: number, tasks: any[]) => Promise<AchievementId[]>;
  updateStreak: () => Promise<void>;
  resetAchievements: () => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(getInitialAchievements());
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: '',
  });

  useEffect(() => {
    loadAchievements();
    loadStreak();
  }, []);

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      if (stored) {
        setAchievements(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadStreak = async () => {
    try {
      const stored = await AsyncStorage.getItem(STREAK_KEY);
      if (stored) {
        setStreak(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const saveAchievements = async (newAchievements: Achievement[]) => {
    try {
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(newAchievements));
      setAchievements(newAchievements);
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  };

  const saveStreak = async (newStreak: StreakData) => {
    try {
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
      setStreak(newStreak);
    } catch (error) {
      console.error('Error saving streak:', error);
    }
  };

  const getTodayString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const updateStreak = async () => {
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let newStreak = { ...streak };

    if (streak.lastCompletionDate === today) {
      // Already completed today, no change
      return;
    } else if (
      streak.lastCompletionDate === yesterdayString ||
      streak.lastCompletionDate === ''
    ) {
      // Continue streak
      newStreak.currentStreak = streak.currentStreak + 1;
      newStreak.lastCompletionDate = today;
      newStreak.longestStreak = Math.max(newStreak.longestStreak, newStreak.currentStreak);
    } else {
      // Streak broken, start new
      newStreak.currentStreak = 1;
      newStreak.lastCompletionDate = today;
      newStreak.longestStreak = Math.max(newStreak.longestStreak, 1);
    }

    await saveStreak(newStreak);
  };

  const checkAndUnlockAchievements = async (
    totalCompleted: number,
    tasks: any[]
  ): Promise<AchievementId[]> => {
    const newAchievements = [...achievements];
    const newlyUnlocked: AchievementId[] = [];

    // Check each achievement
    newAchievements.forEach((achievement) => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;
      let progress = 0;

      switch (achievement.id) {
        case 'first_task':
          progress = totalCompleted;
          shouldUnlock = totalCompleted >= 1;
          break;

        case 'task_master_10':
          progress = totalCompleted;
          shouldUnlock = totalCompleted >= 10;
          break;

        case 'task_master_50':
          progress = totalCompleted;
          shouldUnlock = totalCompleted >= 50;
          break;

        case 'task_master_100':
          progress = totalCompleted;
          shouldUnlock = totalCompleted >= 100;
          break;

        case 'streak_3':
          progress = streak.currentStreak;
          shouldUnlock = streak.currentStreak >= 3;
          break;

        case 'streak_7':
          progress = streak.currentStreak;
          shouldUnlock = streak.currentStreak >= 7;
          break;

        case 'streak_30':
          progress = streak.currentStreak;
          shouldUnlock = streak.currentStreak >= 30;
          break;

        case 'week_warrior':
          // Check if completed tasks in last 7 days, one per day
          const last7Days = tasks.filter((t) => {
            if (!t.completed || !t.completedAt) return false;
            const daysDiff = Math.floor((Date.now() - t.completedAt) / (24 * 60 * 60 * 1000));
            return daysDiff < 7;
          });
          const uniqueDays = new Set(
            last7Days.map((t) => new Date(t.completedAt!).toDateString())
          );
          progress = uniqueDays.size;
          shouldUnlock = uniqueDays.size >= 7;
          break;

        case 'category_master':
          const completedTasks = tasks.filter((t) => t.completed);
          const uniqueCategories = new Set(completedTasks.map((t) => t.category));
          progress = uniqueCategories.size;
          shouldUnlock = uniqueCategories.size >= 5;
          break;

        case 'priority_pro':
          const highPriorityCompleted = tasks.filter(
            (t) => t.completed && t.priority === 'high'
          ).length;
          progress = highPriorityCompleted;
          shouldUnlock = highPriorityCompleted >= 10;
          break;

        case 'early_bird':
          const earlyTasks = tasks.filter((t) => {
            if (!t.completed || !t.completedAt) return false;
            const hour = new Date(t.completedAt).getHours();
            return hour < 9;
          }).length;
          progress = earlyTasks;
          shouldUnlock = earlyTasks >= 5;
          break;

        case 'night_owl':
          const lateTasks = tasks.filter((t) => {
            if (!t.completed || !t.completedAt) return false;
            const hour = new Date(t.completedAt).getHours();
            return hour >= 22;
          }).length;
          progress = lateTasks;
          shouldUnlock = lateTasks >= 5;
          break;
      }

      achievement.progress = progress;

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        newlyUnlocked.push(achievement.id);
      }
    });

    await saveAchievements(newAchievements);
    return newlyUnlocked;
  };

  const resetAchievements = async () => {
    const initial = getInitialAchievements();
    await saveAchievements(initial);
    await saveStreak({ currentStreak: 0, longestStreak: 0, lastCompletionDate: '' });
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        streak,
        checkAndUnlockAchievements,
        updateStreak,
        resetAchievements,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = (): AchievementContextType => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider');
  }
  return context;
};
