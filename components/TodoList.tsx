'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Search, Tag, Calendar, Trash2, Flag, Info } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState('default');
  const [newPriority, setNewPriority] = useState<TodoPriority>('medium');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim(), newCategory, selectedDate, newPriority);
      setNewTodo('');
      setSelectedDate(undefined);
      setNewCategory('default');
      setNewPriority('medium');
      toast({
        title: "Task added",
        description: "Your new task has been created.",
      });
    }
  };

  const handleDelete = (id: string, text: string) => {
    deleteTodo(id);
    toast({
      title: "Task deleted",
      description: `"${text}" has been removed.`,
      variant: "destructive",
    });
  };

  const handleToggle = (todo: Todo) => {
    toggleTodo(todo.id);
    toast({
      title: todo.completed ? "Task uncompleted" : "Task completed",
      description: `"${todo.text}" marked as ${todo.completed ? 'uncompleted' : 'completed'}.`,
    });
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? !todo.completed :
      todo.completed;
    
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-blue-500">Tasks</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Info className="h-4 w-4" />
                    Keyboard Shortcuts
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-2">
                    <p>Press "/" to focus search</p>
                    <p>Press "Enter" to add task</p>
                    <p>Press "Esc" to clear input</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>{activeTodos} active</span>
            <span>•</span>
            <span>{completedTodos} completed</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks... (Press '/' to focus)"
              className="pl-9 bg-[#151922] border-none text-gray-300 placeholder-gray-500"
            />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-[#151922] border-none text-gray-300 placeholder-gray-500"
            />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="w-[110px] bg-[#151922] border-none text-gray-300">
                      <Tag className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151922] border-gray-700">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>Select category</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select value={newPriority} onValueChange={setNewPriority as any}>
                    <SelectTrigger className="w-[100px] bg-[#151922] border-none text-gray-300">
                      <Flag className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#151922] border-gray-700">
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>Set priority</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-10 p-0 bg-[#151922] border-none",
                          selectedDate && "text-blue-500"
                        )}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarUI
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </TooltipTrigger>
              <TooltipContent>Set due date</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add task (Enter)</TooltipContent>
            </Tooltip>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleToggle(todo)}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      todo.completed ? "border-blue-500 bg-blue-500" : "border-gray-500 hover:border-blue-500"
                    )}
                  >
                    {todo.completed && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Mark as {todo.completed ? 'uncompleted' : 'completed'}</TooltipContent>
              </Tooltip>
              
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
                {todo.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Due {format(todo.dueDate, 'PPP')}
                  </p>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(todo.id, todo.text)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete task</TooltipContent>
              </Tooltip>
            </div>
          ))}

          {filteredTodos.length === 0 && (
            <div className="text-center py-12 text-gray-500 animate-fadeIn">
              {searchQuery ? 'No matching tasks found' : 'No tasks yet'}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}