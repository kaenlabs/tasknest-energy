export type EnergyLevel = 'low' | 'high';
export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'health' | 'shopping' | 'other';

// Task status for overdue system
export type TaskStatus = 
  | 'active'      // Not yet due or no schedule
  | 'overdue'     // Past due date/time, awaiting action
  | 'completed'   // Completed normally
  | 'skipped'     // Skipped by user (-5 points)
  | 'failed';     // Failed/cancelled (-10 points)

export interface Task {
  id: string;
  title: string;
  note?: string;
  energy: EnergyLevel;
  priority: Priority;
  category: Category;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  estimatedDuration?: string; // e.g., "15 mins", "1 hour", "2+ hours"
  scheduledDate?: number; // timestamp for the scheduled day (start of day)
  scheduledTime?: string; // e.g., "09:00", "14:30"
  isScheduled?: boolean; // quick flag to filter scheduled tasks
  
  // Overdue system fields
  status: TaskStatus;
  skippedAt?: number;
  failedAt?: number;
  pointsEarned: number; // Points from this task (+10, -5, -10, etc)
}

export type TaskFilter = 'all' | 'low' | 'high' | 'completed';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byCategory: Record<Category, number>;
  byPriority: Record<Priority, number>;
  thisWeek: number[];
}
