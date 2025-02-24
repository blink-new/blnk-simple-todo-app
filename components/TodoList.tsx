import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Search, Tag, Calendar, Info, Flag, LayoutGrid, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TodoFilter, ViewMode } from '@/lib/types';
import { useTodoStore } from '@/lib/store';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { TodoItem } from './TodoItem';
import { useToast } from "@/components/ui/use-toast";
import { useHotkeys } from 'react-hotkeys-hook';

export function TodoList() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    reorderTodos,
    undo,
    redo
  } = useTodoStore();
  
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState('default');
  const [newPriority, setNewPriority] = useState('medium');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Keyboard shortcuts
  useHotkeys('mod+z', () => undo(), { preventDefault: true });
  useHotkeys('mod+shift+z', () => redo(), { preventDefault: true });
  useHotkeys('/', () => {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput && document.activeElement?.tagName !== 'INPUT') {
      searchInput.focus();
    }
  }, { preventDefault: true });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      reorderTodos(oldIndex, newIndex);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim(), newCategory, selectedDate, newPriority as any);
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

  const handleDelete = (id: string) => {
    deleteTodo(id);
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
      variant: "destructive",
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
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode(viewMode === 'list' ? 'board' : 'list')}
                  >
                    {viewMode === 'list' ? (
                      <LayoutGrid className="h-4 w-4" />
                    ) : (
                      <LayoutList className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Switch to {viewMode === 'list' ? 'board' : 'list'} view
                </TooltipContent>
              </Tooltip>

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
                    <p>Press "⌘Z" to undo</p>
                    <p>Press "⌘⇧Z" to redo</p>
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
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks... (Press '/' to focus)"
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
                  <Select value={newPriority} onValueChange={setNewPriority}>
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTodos.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={handleDelete}
                  onUpdate={updateTodo}
                  isSelected={selectedTodos.includes(todo.id)}
                  onSelect={(id) => {
                    setSelectedTodos(prev =>
                      prev.includes(id)
                        ? prev.filter(i => i !== id)
                        : [...prev, id]
                    );
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>

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