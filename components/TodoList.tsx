import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, Circle, Trash2, Plus, Search, Tag, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { TodoFilter, Todo, TodoPriority, CATEGORY_COLORS, PRIORITY_CONFIG } from '@/lib/types';
import { useTodos } from '@/hooks/useTodos';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState('default');
  const [newPriority, setNewPriority] = useState<TodoPriority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim(), newCategory, selectedDate, newPriority);
      setNewTodo('');
      setSelectedDate(undefined);
      setNewCategory('default');
      setNewPriority('medium');
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? !todo.completed :
      todo.completed;
    
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 space-y-6 shadow-lg border-t-4 border-primary">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Tasks
        </h1>
        <p className="text-muted-foreground">
          {todos.filter(t => !t.completed).length} tasks remaining
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="pl-9"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        
        <Select value={newCategory} onValueChange={setNewCategory}>
          <SelectTrigger className="w-[110px]">
            <Tag className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(CATEGORY_COLORS).map(category => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={newPriority} onValueChange={setNewPriority as any}>
          <SelectTrigger className="w-[100px]">
            <Flag className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
              <SelectItem key={priority} value={priority} className="capitalize">
                {config.icon} {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-10 p-0",
                selectedDate && "text-primary"
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

        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
          size="sm"
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          size="sm"
        >
          Completed
        </Button>
      </div>

      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "group flex items-center gap-3 p-4 rounded-lg transition-all",
              "hover:bg-muted/50",
              "animate-fadeIn",
              todo.completed && "opacity-50"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleTodo(todo.id)}
              className="shrink-0"
            >
              {todo.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </Button>
            
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className={cn(
                  "text-sm font-medium truncate",
                  todo.completed && "line-through"
                )}>
                  {todo.text}
                </p>
                <span className={cn(
                  "text-sm px-2 py-0.5 rounded-full capitalize",
                  CATEGORY_COLORS[todo.category].bg,
                  CATEGORY_COLORS[todo.category].text
                )}>
                  {todo.category}
                </span>
                <span className={cn(
                  "text-sm",
                  PRIORITY_CONFIG[todo.priority].class
                )}>
                  {PRIORITY_CONFIG[todo.priority].icon}
                </span>
              </div>
              {todo.dueDate && (
                <p className="text-xs text-muted-foreground">
                  Due {format(todo.dueDate, 'PPP')}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {filteredTodos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground animate-fadeIn">
            {searchQuery ? 'No matching tasks found' : 'No tasks yet'}
          </div>
        )}
      </div>
    </Card>
  );
}