'use client';

import { useState } from 'react';
import { Plus, Search, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TodoFilter, Todo, TodoPriority } from '@/lib/types';
import { useTodos } from '@/hooks/useTodos';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState('default');
  const [newPriority, setNewPriority] = useState<TodoPriority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim(), newCategory, undefined, newPriority);
      setNewTodo('');
      setNewCategory('default');
      setNewPriority('medium');
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? !todo.completed :
      todo.completed;
    
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-blue-500">Tasks</h1>
        <p className="text-gray-400">
          {todos.filter(t => !t.completed).length} tasks remaining
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 bg-[#151922] border-none text-gray-300 placeholder-gray-500"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-[#151922] border-none text-gray-300 placeholder-gray-500"
          />
          
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="w-[110px] bg-[#151922] border-none text-gray-300">
              <Tag className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#151922] border-gray-700">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="work">Work</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            onClick={() => setFilter('all')}
            size="sm"
            className={cn(
              "text-sm",
              filter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : 'text-gray-400 hover:text-gray-300'
            )}
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'ghost'}
            onClick={() => setFilter('active')}
            size="sm"
            className={cn(
              "text-sm",
              filter === 'active' ? 'bg-blue-500 hover:bg-blue-600' : 'text-gray-400 hover:text-gray-300'
            )}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'ghost'}
            onClick={() => setFilter('completed')}
            size="sm"
            className={cn(
              "text-sm",
              filter === 'completed' ? 'bg-blue-500 hover:bg-blue-600' : 'text-gray-400 hover:text-gray-300'
            )}
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "group flex items-center gap-3 p-4 rounded-lg transition-all bg-[#151922]",
              "hover:bg-[#1A1F2A]",
              "animate-fadeIn",
              todo.completed && "opacity-50"
            )}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                todo.completed ? "border-blue-500 bg-blue-500" : "border-gray-500"
              )}
            >
              {todo.completed && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={cn(
                  "text-gray-300 font-medium",
                  todo.completed && "line-through text-gray-500"
                )}>
                  {todo.text}
                </p>
                <span className="text-sm px-2 py-0.5 rounded-full bg-[#1D2232] text-gray-400 capitalize">
                  {todo.category}
                </span>
                <span className="text-sm">
                  {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                </span>
              </div>
            </div>

            <button
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-400"
            >
              ×
            </button>
          </div>
        ))}

        {filteredTodos.length === 0 && (
          <div className="text-center py-12 text-gray-500 animate-fadeIn">
            {searchQuery ? 'No matching tasks found' : 'No tasks yet'}
          </div>
        )}
      </div>
    </div>
  );
}