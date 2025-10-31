import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, EnergyLevel, Priority, Category, TaskStatus } from '../types/task.types';
import { scheduleTaskNotification, scheduleDailyReminder, sendOverdueNotification } from '../services/notificationService';

interface TaskContextType {
  tasks: Task[];
  addTask: (
    title: string,
    note: string,
    energy: EnergyLevel,
    priority: Priority,
    category: Category,
    estimatedDuration?: string,
    scheduledDate?: number,
    scheduledTime?: string
  ) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  updateTask: (
    id: string,
    title: string,
    note: string,
    energy: EnergyLevel,
    priority: Priority,
    category: Category,
    estimatedDuration?: string,
    scheduledDate?: number,
    scheduledTime?: string
  ) => void;
  
  // Overdue task actions
  markTaskAsSkipped: (id: string) => void;
  markTaskAsFailed: (id: string) => void;
  checkOverdueTasks: () => void;
  
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = '@TaskNest:tasks';

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveTasks();
    }
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        
        // Migrate old tasks to new format (add status and pointsEarned if missing)
        const migratedTasks = parsedTasks.map((task: Task) => ({
          ...task,
          status: task.status || 'active',
          pointsEarned: task.pointsEarned || 0,
        }));
        
        setTasks(migratedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = (
    title: string,
    note: string,
    energy: EnergyLevel,
    priority: Priority = 'medium',
    category: Category = 'other',
    estimatedDuration?: string,
    scheduledDate?: number,
    scheduledTime?: string
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      note,
      energy,
      priority,
      category,
      completed: false,
      createdAt: Date.now(),
      estimatedDuration,
      scheduledDate,
      scheduledTime,
      isScheduled: !!(scheduledDate || scheduledTime),
      
      // Overdue system defaults
      status: 'active',
      pointsEarned: 0,
    };
    setTasks([newTask, ...tasks]);
    
    // Schedule notification if task has date and time
    if (scheduledDate && scheduledTime) {
      scheduleTaskNotification(newTask).then(notificationId => {
        console.log('📅 Task notification scheduled:', notificationId);
        console.log('📅 Task:', newTask.title);
        console.log('📅 Date:', new Date(scheduledDate).toLocaleString('tr-TR'));
        console.log('📅 Time:', scheduledTime);
      });
    }
    
    // Update daily reminder with today's tasks
    const allTasks = [newTask, ...tasks];
    const today = new Date();
    const todayTasks = allTasks.filter(t => {
      if (!t.scheduledDate) return false;
      const taskDate = new Date(t.scheduledDate);
      return taskDate.toDateString() === today.toDateString();
    });
    scheduleDailyReminder(todayTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    
    // Update daily reminder
    const today = new Date();
    const todayTasks = updatedTasks.filter(t => {
      if (!t.scheduledDate) return false;
      const taskDate = new Date(t.scheduledDate);
      return taskDate.toDateString() === today.toDateString();
    });
    scheduleDailyReminder(todayTasks);
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? Date.now() : undefined,
            status: !task.completed ? 'completed' as TaskStatus : task.status,
            pointsEarned: !task.completed && task.pointsEarned === 0 ? 10 : task.pointsEarned,
          }
        : task
    );
    setTasks(updatedTasks);
    
    // Update daily reminder
    const today = new Date();
    const todayTasks = updatedTasks.filter(t => {
      if (!t.scheduledDate) return false;
      const taskDate = new Date(t.scheduledDate);
      return taskDate.toDateString() === today.toDateString();
    });
    scheduleDailyReminder(todayTasks);
  };

  const updateTask = (
    id: string,
    title: string,
    note: string,
    energy: EnergyLevel,
    priority: Priority,
    category: Category,
    estimatedDuration?: string,
    scheduledDate?: number,
    scheduledTime?: string
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id 
        ? { 
            ...task, 
            title, 
            note, 
            energy, 
            priority, 
            category, 
            estimatedDuration,
            scheduledDate,
            scheduledTime,
            isScheduled: !!(scheduledDate || scheduledTime),
          } 
        : task
    );
    setTasks(updatedTasks);
    
    // Reschedule notification for updated task
    const updatedTask = updatedTasks.find(t => t.id === id);
    if (updatedTask && scheduledDate && scheduledTime) {
      scheduleTaskNotification(updatedTask);
    }
    
    // Update daily reminder
    const today = new Date();
    const todayTasks = updatedTasks.filter(t => {
      if (!t.scheduledDate) return false;
      const taskDate = new Date(t.scheduledDate);
      return taskDate.toDateString() === today.toDateString();
    });
    scheduleDailyReminder(todayTasks);
  };

  // Mark task as skipped (-5 points)
  const markTaskAsSkipped = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'skipped' as TaskStatus,
              skippedAt: Date.now(),
              pointsEarned: -5,
            }
          : task
      )
    );
    console.log(`⏭️ Task skipped: ${id} (-5 points)`);
  };

  // Mark task as failed (-10 points)
  const markTaskAsFailed = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'failed' as TaskStatus,
              failedAt: Date.now(),
              pointsEarned: -10,
            }
          : task
      )
    );
    console.log(`❌ Task failed: ${id} (-10 points)`);
  };

  // Check for overdue tasks
  const checkOverdueTasks = useCallback(() => {
    setTasks((currentTasks) => {
      const now = Date.now();
      let hasChanges = false;
      
      const updatedTasks = currentTasks.map((task) => {
        // Skip if already completed, skipped, or failed
        if (task.status === 'completed' || task.status === 'skipped' || task.status === 'failed') {
          return task;
        }

        // Check if task has schedule
        if (!task.scheduledDate || !task.scheduledTime) {
          return task;
        }

        // Parse scheduled time
        const [hours, minutes] = task.scheduledTime.split(':').map(Number);
        const scheduledDateTime = new Date(task.scheduledDate);
        scheduledDateTime.setHours(hours, minutes, 0, 0);

        // Check if overdue
        if (scheduledDateTime.getTime() < now) {
          // Check if 24 hours passed - auto fail
          const hoursPassed = (now - scheduledDateTime.getTime()) / (1000 * 60 * 60);
          if (hoursPassed >= 24) {
            console.log(`⏰ Task auto-failed (24h passed): ${task.title}`);
            hasChanges = true;
            return {
              ...task,
              status: 'failed' as TaskStatus,
              failedAt: now,
              pointsEarned: -15,
            };
          }

          // Just mark as overdue if not already
          if (task.status === 'active') {
            console.log(`⚠️ Task became overdue: ${task.title}`);
            hasChanges = true;
            
            // Send overdue notification
            sendOverdueNotification(task).catch(err => {
              console.error('Failed to send overdue notification:', err);
            });
            
            return {
              ...task,
              status: 'overdue' as TaskStatus,
            };
          }
        }

        return task;
      });

      // Only update if there were actual changes
      return hasChanges ? updatedTasks : currentTasks;
    });
  }, []);

  // Check overdue tasks every minute
  useEffect(() => {
    if (isLoading) return;
    
    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []); // Run only once on mount and set up interval

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTaskCompletion,
        updateTask,
        markTaskAsSkipped,
        markTaskAsFailed,
        checkOverdueTasks,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

// Alias for consistency
export const useTaskContext = useTasks;
