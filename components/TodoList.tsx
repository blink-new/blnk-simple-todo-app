import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, Circle, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { TodoFilter, Todo } from '@/lib/types';
import { useTodos } from '@/hooks/useTodos';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim(), 'default', selectedDate);
      setNewTodo('');
      setSelectedDate(undefined);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          {todos.filter(t => !t.completed).length} tasks remaining
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
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
          <PopoverContent className="w-auto p-0">
            <CalendarUI
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button type="submit">
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
              "flex items-center gap-2 p-4 rounded-lg transition-all",
              "hover:bg-muted/50",
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
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium truncate",
                todo.completed && "line-through"
              )}>
                {todo.text}
              </p>
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
              className="shrink-0 text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {filteredTodos.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No tasks found
          </div>
        )}
      </div>
    </Card>
  );
}