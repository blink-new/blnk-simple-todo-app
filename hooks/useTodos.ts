import { useState, useEffect } from 'react';
import { Todo, TodoPriority } from '@/lib/types';

const getInitialTodos = (): Todo[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('todos');
    if (saved) {
      return JSON.parse(saved, (key, value) => {
        if (key === 'dueDate' || key === 'createdAt') {
          return value ? new Date(value) : null;
        }
        return value;
      });
    }
  }
  return [];
};

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(getInitialTodos);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (
    text: string,
    category: string = 'default',
    dueDate?: Date,
    priority: TodoPriority = 'medium'
  ) => {
    setTodos(prev => [
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        category,
        priority,
        dueDate,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  };
}