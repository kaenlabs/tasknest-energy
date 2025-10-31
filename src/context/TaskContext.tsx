import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, EnergyLevel, Priority, Category } from '../types/task.types';
import { scheduleTaskNotification, scheduleDailyReminder } from '../services/notificationService';

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
        setTasks(JSON.parse(savedTasks));
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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTaskCompletion,
        updateTask,
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
