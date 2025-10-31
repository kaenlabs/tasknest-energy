export type EnergyLevel = 'low' | 'high';
export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'health' | 'shopping' | 'other';

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
