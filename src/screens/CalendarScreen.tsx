import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../locales/i18n';
import { Task } from '../types/task.types';
import { TaskCard } from '../components/TaskCard';
import { hapticFeedback } from '../utils/haptics';
import { useAchievements } from '../context/AchievementContext';
import { usePoints, POINTS_CONFIG } from '../context/PointsContext';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 7;

interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

export const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const { updateStreak, checkAndUnlockAchievements } = useAchievements();
  const { addPoints } = usePoints();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Helper function to get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    const dateTimestamp = date.getTime();
    return tasks.filter(task => task.scheduledDate === dateTimestamp);
  };

  // Generate calendar grid
  const calendarDays = useMemo((): DayCell[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Previous month's days to fill the grid
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    
    const days: DayCell[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      date.setHours(0, 0, 0, 0);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        tasks: getTasksForDate(date),
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        tasks: getTasksForDate(date),
      });
    }
    
    // Add next month's days to complete the grid
    const remainingCells = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      date.setHours(0, 0, 0, 0);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        tasks: getTasksForDate(date),
      });
    }
    
    return days;
  }, [currentDate, tasks]);

  const handlePreviousMonth = () => {
    hapticFeedback.light();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    hapticFeedback.light();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleToday = () => {
    hapticFeedback.medium();
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const handleDayPress = (day: DayCell) => {
    hapticFeedback.selection();
    setSelectedDate(day.date);
  };

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    
    if (task && !task.completed) {
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
      
      await addPoints(task.id, task.title, points, action);
      await updateStreak();
      
      setTimeout(async () => {
        const completedCount = tasks.filter((t) => t.completed).length + 1;
        await checkAndUnlockAchievements(completedCount, tasks);
      }, 100);
    } else {
      hapticFeedback.light();
    }
    
    toggleTaskCompletion(id);
  };

  const handleDelete = (id: string) => {
    hapticFeedback.warning();
    deleteTask(id);
  };

  const getMonthYearText = (): string => {
    return currentDate.toLocaleDateString('tr-TR', {
      month: 'long',
      year: 'numeric',
    });
  };

  const selectedDayTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.monthYearText, { color: theme.text }]}>
            {getMonthYearText()}
          </Text>
          <TouchableOpacity onPress={handleToday} style={[styles.todayButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.todayButtonText}>{translate('scheduled.today')}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={handleNextMonth} style={styles.headerButton}>
          <Ionicons name="chevron-forward" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdayRow}>
        {['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'].map((day, index) => (
          <View key={index} style={[styles.weekdayCell, { width: CELL_SIZE }]}>
            <Text style={[styles.weekdayText, { color: theme.textSecondary }]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <ScrollView style={styles.calendarScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => {
            const isSelected = selectedDate?.getTime() === day.date.getTime();
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  { width: CELL_SIZE, height: CELL_SIZE },
                  day.isToday && [styles.todayCell, { borderColor: theme.primary }],
                  isSelected && [styles.selectedCell, { backgroundColor: theme.primary + '20' }],
                ]}
                onPress={() => handleDayPress(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: day.isCurrentMonth ? theme.text : theme.textSecondary },
                    day.isToday && [styles.todayText, { color: theme.primary }],
                  ]}
                >
                  {day.date.getDate()}
                </Text>
                
                {/* Task Indicators */}
                {day.tasks.length > 0 && (
                  <View style={styles.taskIndicators}>
                    {day.tasks.slice(0, 3).map((task, taskIndex) => (
                      <View
                        key={taskIndex}
                        style={[
                          styles.taskDot,
                          {
                            backgroundColor: task.completed
                              ? theme.success
                              : task.priority === 'high'
                              ? '#EF4444'
                              : task.priority === 'medium'
                              ? '#F59E0B'
                              : theme.primary,
                          },
                        ]}
                      />
                    ))}
                    {day.tasks.length > 3 && (
                      <Text style={[styles.moreTasksText, { color: theme.textSecondary }]}>
                        +{day.tasks.length - 3}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Day Tasks */}
        {selectedDate && (
          <View style={[styles.selectedDaySection, { backgroundColor: theme.surface }]}>
            <View style={styles.selectedDayHeader}>
              <Text style={[styles.selectedDayTitle, { color: theme.text }]}>
                {selectedDate.toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <View style={[styles.taskCountBadge, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.taskCountText, { color: theme.primary }]}>
                  {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'görev' : 'görev'}
                </Text>
              </View>
            </View>

            {selectedDayTasks.length === 0 ? (
              <View style={styles.noTasksContainer}>
                <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
                <Text style={[styles.noTasksText, { color: theme.textSecondary }]}>
                  Bu gün için planlanmış görev yok
                </Text>
              </View>
            ) : (
              <View style={styles.tasksContainer}>
                {selectedDayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={() => handleToggleComplete(task.id)}
                    onDelete={() => handleDelete(task.id)}
                    onPress={() => {
                      // TODO: Open task detail
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  monthYearText: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  weekdayCell: {
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  calendarScroll: {
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  todayCell: {
    borderWidth: 2,
    borderRadius: 8,
  },
  selectedCell: {
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  todayText: {
    fontWeight: '700',
  },
  taskIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreTasksText: {
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 2,
  },
  selectedDaySection: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 100,
  },
  selectedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textTransform: 'capitalize',
  },
  taskCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  taskCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noTasksContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  noTasksText: {
    fontSize: 14,
    textAlign: 'center',
  },
  tasksContainer: {
    gap: 12,
  },
});
