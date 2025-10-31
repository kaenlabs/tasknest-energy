import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { useAchievements } from '../context/AchievementContext';
import { usePoints, POINTS_CONFIG } from '../context/PointsContext';
import { TaskFilter, Task } from '../types/task.types';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import { AddTaskModal } from '../components/AddTaskModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { EmptyState } from '../components/EmptyState';
import { DevTools } from '../components/DevTools';
import { AppTutorial } from '../components/AppTutorial';
import { StreakCard } from '../components/StreakCard';
import { PointsFloatingNotification } from '../components/PointsFloatingNotification';
import { LevelUpCelebration } from '../components/LevelUpCelebration';
import { hapticFeedback } from '../utils/haptics';
import { translate } from '../locales/i18n';

const { width, height } = Dimensions.get('window');
const TUTORIAL_KEY = '@TaskNest:tutorial_completed';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const HomeScreen: React.FC = () => {
  const { theme, colorScheme } = useTheme();
  const { locale } = useLocale(); // This will trigger re-render on language change
  const { tasks, addTask, deleteTask, toggleTaskCompletion, updateTask } = useTasks();
  const { streak, updateStreak, checkAndUnlockAchievements } = useAchievements();
  const { addPoints } = usePoints();
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Points animation states
  const [pointsNotification, setPointsNotification] = useState<{
    points: number;
    action: 'complete' | 'complete_on_time' | 'skip' | 'fail' | 'auto_fail';
  } | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number } | null>(null);

  const animatedValues = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    checkTutorialStatus();
  }, []);

  const checkTutorialStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(TUTORIAL_KEY);
      if (value === null && tasks.length === 0) {
        // Show tutorial for first-time users with no tasks
        setTimeout(() => setShowTutorial(true), 500);
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    }
  };

  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
      setShowTutorial(false);
    } catch (error) {
      console.error('Error saving tutorial status:', error);
    }
  };

  const tutorialSteps = [
    {
      title: translate('tutorial.step1.title'),
      description: translate('tutorial.step1.description'),
      targetPosition: {
        x: width - 104,
        y: height - 110,
        width: 64,
        height: 64,
      },
      arrow: 'bottom' as const,
    },
    {
      title: translate('tutorial.step2.title'),
      description: translate('tutorial.step2.description'),
      targetPosition: {
        x: 20,
        y: height / 2 - 50,
        width: 100,
        height: 100,
      },
      arrow: 'left' as const,
    },
    {
      title: translate('tutorial.step3.title'),
      description: translate('tutorial.step3.description'),
      targetPosition: {
        x: 20,
        y: 180,
        width: width - 40,
        height: 50,
      },
      arrow: 'top' as const,
    },
    {
      title: translate('tutorial.step4.title'),
      description: translate('tutorial.step4.description'),
      targetPosition: {
        x: width - 120,
        y: 60,
        width: 100,
        height: 44,
      },
      arrow: 'top' as const,
    },
  ];

  const getFilteredTasks = (): Task[] => {
    let filtered = [...tasks];

    switch (activeFilter) {
      case 'high':
        filtered = filtered.filter((task) => task.energy === 'high' && !task.completed);
        break;
      case 'low':
        filtered = filtered.filter((task) => task.energy === 'low' && !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter((task) => task.completed);
        break;
      case 'all':
      default:
        break;
    }

    return filtered;
  };

  const handleFilterChange = (filter: TaskFilter) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFilter(filter);
  };

  const handleAddTask = (
    title: string,
    note: string,
    energy: 'low' | 'high',
    priority: 'low' | 'medium' | 'high',
    category: 'work' | 'personal' | 'health' | 'shopping' | 'other',
    estimatedDuration?: string,
    scheduledDate?: number,
    scheduledTime?: string
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (editingTask) {
      // Update existing task
      updateTask(editingTask.id, title, note, energy, priority, category, estimatedDuration, scheduledDate, scheduledTime);
      setEditingTask(null);
      hapticFeedback.success();
    } else {
      // Add new task
      addTask(title, note, energy, priority, category, estimatedDuration, scheduledDate, scheduledTime);
      hapticFeedback.light();
    }
  };

  const handleDeleteTask = (id: string) => {
    hapticFeedback.warning(); // Warning feedback for delete action
    
    // Animate out
    if (!animatedValues[id]) {
      animatedValues[id] = new Animated.Value(1);
    }

    Animated.timing(animatedValues[id], {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      deleteTask(id);
      delete animatedValues[id];
    });
  };

  const handleToggleComplete = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const task = tasks.find((t) => t.id === id);
    
    if (task && !task.completed) {
      // Completing a task - success haptic!
      hapticFeedback.medium();
      
      // Calculate points based on task timing
      let points = POINTS_CONFIG.COMPLETE_NORMAL;
      let action: 'complete' | 'complete_on_time' = 'complete';
      
      // Check if task has schedule and completed on time
      if (task.scheduledDate && task.scheduledTime) {
        const [hours, minutes] = task.scheduledTime.split(':').map(Number);
        const scheduledDateTime = new Date(task.scheduledDate);
        scheduledDateTime.setHours(hours, minutes, 0, 0);
        
        if (Date.now() < scheduledDateTime.getTime()) {
          // Completed before scheduled time - bonus!
          points = POINTS_CONFIG.COMPLETE_ON_TIME;
          action = 'complete_on_time';
        }
      }
      
      // Add points and check for level up
      const result = await addPoints(task.id, task.title, points, action);
      
      // Show points notification
      setPointsNotification({ points, action });
      
      // Show level up celebration if leveled up
      if (result.leveledUp) {
        setTimeout(() => {
          setLevelUpData({ level: result.newLevel });
        }, 2000); // Show after points notification
      }
      
      await updateStreak();
      
      // Check achievements after a small delay to get updated tasks
      setTimeout(async () => {
        const completedCount = tasks.filter((t) => t.completed).length + 1;
        await checkAndUnlockAchievements(completedCount, tasks);
      }, 100);
    } else {
      // Uncompleting a task - light feedback
      hapticFeedback.light();
    }
    
    toggleTaskCompletion(id);
  };

  const getAnimatedValue = (id: string): Animated.Value => {
    if (!animatedValues[id]) {
      animatedValues[id] = new Animated.Value(1);
    }
    return animatedValues[id];
  };

  const filteredTasks = getFilteredTasks();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />

      <Header />

      <StreakCard currentStreak={streak.currentStreak} longestStreak={streak.longestStreak} />

      <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      <View style={styles.listContainer}>
        {filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onToggleComplete={() => handleToggleComplete(item.id)}
                onDelete={() => handleDeleteTask(item.id)}
                onPress={() => {
                  setSelectedTask(item);
                  setIsDetailModalVisible(true);
                  hapticFeedback.light();
                }}
                animatedValue={getAnimatedValue(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => {
          hapticFeedback.light();
          setIsModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleAddTask}
        editTask={editingTask}
      />

      <TaskDetailModal
        visible={isDetailModalVisible}
        task={selectedTask}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedTask(null);
        }}
        onEdit={() => {
          if (selectedTask) {
            setEditingTask(selectedTask);
            setIsDetailModalVisible(false);
            setIsModalVisible(true);
            hapticFeedback.light();
          }
        }}
        onDelete={() => {
          if (selectedTask) {
            handleDeleteTask(selectedTask.id);
            setIsDetailModalVisible(false);
            setSelectedTask(null);
            hapticFeedback.success();
          }
        }}
      />

      <AppTutorial
        visible={showTutorial}
        steps={tutorialSteps}
        onComplete={handleTutorialComplete}
      />

      {/* Points Floating Notification */}
      {pointsNotification && (
        <PointsFloatingNotification
          points={pointsNotification.points}
          action={pointsNotification.action}
          onAnimationComplete={() => setPointsNotification(null)}
        />
      )}

      {/* Level Up Celebration */}
      {levelUpData && (
        <LevelUpCelebration
          level={levelUpData.level}
          onAnimationComplete={() => setLevelUpData(null)}
        />
      )}

      <DevTools />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
