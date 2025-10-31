import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Points configuration
export const POINTS_CONFIG = {
  COMPLETE_NORMAL: 10,        // Normal completion
  COMPLETE_ON_TIME: 15,       // Completed before due time
  SKIP: -5,                   // User skipped the task
  FAIL: -10,                  // User marked as failed
  AUTO_FAIL: -15,             // Auto-failed after 24 hours
};

// Level system configuration
export const LEVEL_CONFIG = {
  pointsPerLevel: 100,  // 100 points = 1 level
  maxLevel: 50,
};

export interface PointsHistory {
  id: string;
  taskId: string;
  taskTitle: string;
  points: number;
  action: 'complete' | 'complete_on_time' | 'skip' | 'fail' | 'auto_fail';
  timestamp: number;
}

interface PointsContextType {
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  progressToNextLevel: number; // 0-100
  history: PointsHistory[];
  addPoints: (
    taskId: string,
    taskTitle: string,
    points: number,
    action: PointsHistory['action']
  ) => Promise<void>;
  getRecentHistory: (limit?: number) => PointsHistory[];
  resetPoints: () => Promise<void>;
  isLoading: boolean;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

const STORAGE_KEY = '@TaskNest:points';
const HISTORY_KEY = '@TaskNest:points_history';

export const PointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [history, setHistory] = useState<PointsHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate level from total points
  const currentLevel = Math.floor(Math.max(0, totalPoints) / LEVEL_CONFIG.pointsPerLevel) + 1;
  
  // Calculate points needed for next level
  const pointsInCurrentLevel = Math.max(0, totalPoints) % LEVEL_CONFIG.pointsPerLevel;
  const pointsToNextLevel = LEVEL_CONFIG.pointsPerLevel - pointsInCurrentLevel;
  const progressToNextLevel = (pointsInCurrentLevel / LEVEL_CONFIG.pointsPerLevel) * 100;

  // Load points and history from storage
  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = async () => {
    try {
      setIsLoading(true);
      
      const [pointsData, historyData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(HISTORY_KEY),
      ]);

      if (pointsData) {
        setTotalPoints(JSON.parse(pointsData));
      }

      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePoints = async (newPoints: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPoints));
      setTotalPoints(newPoints);
    } catch (error) {
      console.error('Error saving points:', error);
    }
  };

  const saveHistory = async (newHistory: PointsHistory[]) => {
    try {
      // Keep only last 100 entries
      const trimmedHistory = newHistory.slice(-100);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
      setHistory(trimmedHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const addPoints = async (
    taskId: string,
    taskTitle: string,
    points: number,
    action: PointsHistory['action']
  ) => {
    const newEntry: PointsHistory = {
      id: Date.now().toString(),
      taskId,
      taskTitle,
      points,
      action,
      timestamp: Date.now(),
    };

    const newTotal = totalPoints + points;
    const newHistory = [...history, newEntry];

    await Promise.all([
      savePoints(newTotal),
      saveHistory(newHistory),
    ]);

    console.log(`📊 Points updated: ${points > 0 ? '+' : ''}${points} (Total: ${newTotal})`);
  };

  const getRecentHistory = (limit: number = 10): PointsHistory[] => {
    return history.slice(-limit).reverse();
  };

  const resetPoints = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEY),
        AsyncStorage.removeItem(HISTORY_KEY),
      ]);
      setTotalPoints(0);
      setHistory([]);
      console.log('📊 Points reset successfully');
    } catch (error) {
      console.error('Error resetting points:', error);
    }
  };

  return (
    <PointsContext.Provider
      value={{
        totalPoints,
        currentLevel,
        pointsToNextLevel,
        progressToNextLevel,
        history,
        addPoints,
        getRecentHistory,
        resetPoints,
        isLoading,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = (): PointsContextType => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
