export type EnergyLevel = 'low' | 'high';

export interface Task {
  id: string;
  title: string;
  note?: string;
  energy: EnergyLevel;
  completed: boolean;
  createdAt: number;
}

export type TaskFilter = 'all' | 'low' | 'high' | 'completed';
