export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: TodoPriority;
  dueDate?: Date;
  createdAt: Date;
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  personal: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  work: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  shopping: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  health: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  default: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
};

export const PRIORITY_CONFIG: Record<TodoPriority, { icon: string; class: string }> = {
  high: { icon: '🔴', class: 'text-red-500' },
  medium: { icon: '🟡', class: 'text-yellow-500' },
  low: { icon: '🟢', class: 'text-green-500' },
};