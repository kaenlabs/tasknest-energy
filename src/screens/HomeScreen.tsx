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
import { TaskFilter, Task } from '../types/task.types';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import { AddTaskModal } from '../components/AddTaskModal';
import { EmptyState } from '../components/EmptyState';
import { DevTools } from '../components/DevTools';
import { AppTutorial } from '../components/AppTutorial';
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
  const { tasks, addTask, deleteTask, toggleTaskCompletion } = useTasks();
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

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
    category: 'work' | 'personal' | 'health' | 'shopping' | 'other'
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addTask(title, note, energy, priority, category);
  };

  const handleDeleteTask = (id: string) => {
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

  const handleToggleComplete = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleAddTask}
      />

      <AppTutorial
        visible={showTutorial}
        steps={tutorialSteps}
        onComplete={handleTutorialComplete}
      />

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
