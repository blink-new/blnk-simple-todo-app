import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Calendar, Clock, Flag, Trash2, Plus, CheckCircle2, Filter, MoreVertical } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar as CalendarComponent } from './ui/calendar'
import { cn } from '@/lib/utils'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  category?: string
}

const PRIORITY_COLORS = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-rose-500'
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTodoDate, setNewTodoDate] = useState<Date>()

  // Calculate stats
  const totalTodos = todos.length
  const completedTodos = todos.filter(t => t.completed).length
  const completionRate = totalTodos ? Math.round((completedTodos / totalTodos) * 100) : 0

  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      setTodos(JSON.parse(saved, (key, value) => {
        if (key === 'dueDate' && value) return new Date(value)
        return value
      }))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isLoaded])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    setTodos([...todos, { 
      id: Date.now().toString(), 
      text: newTodo.trim(), 
      completed: false,
      priority: newTodoPriority,
      dueDate: newTodoDate
    }])
    setNewTodo('')
    setNewTodoPriority('medium')
    setNewTodoDate(undefined)
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  if (!isLoaded) {
    return (
      <div className="min-h-[600px] max-w-3xl mx-auto p-8 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your tasks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-[600px] max-w-3xl mx-auto p-8 rounded-xl bg-gradient-to-b from-background to-background/80 shadow-xl border border-border/50">
      {/* Header with Stats */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Task Manager
        </motion.h1>
        
        <div className="mt-6 p-4 bg-card rounded-lg border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">{totalTodos}</span> total tasks
            </div>
            <div>
              <span className="font-medium text-foreground">{completedTodos}</span> completed
            </div>
            <div>
              <span className="font-medium text-foreground">{totalTodos - completedTodos}</span> remaining
            </div>
          </div>
        </div>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="group flex gap-3 mb-8">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 h-12 px-4 text-lg transition-all border-2 border-transparent focus:border-primary/20 rounded-xl"
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Flag className={cn(
                  "w-4 h-4",
                  newTodoPriority === 'low' && "text-emerald-500",
                  newTodoPriority === 'medium' && "text-amber-500",
                  newTodoPriority === 'high' && "text-rose-500"
                )} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setNewTodoPriority('low')}
                >
                  <Flag className="w-4 h-4 text-emerald-500 mr-2" /> Low
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setNewTodoPriority('medium')}
                >
                  <Flag className="w-4 h-4 text-amber-500 mr-2" /> Medium
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setNewTodoPriority('high')}
                >
                  <Flag className="w-4 h-4 text-rose-500 mr-2" /> High
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Calendar className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={newTodoDate}
                onSelect={setNewTodoDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          type="submit" 
          size="lg"
          className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </form>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
        
        <Button variant="ghost" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Todo List */}
      <motion.div 
        className="space-y-3"
        initial={false}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredTodos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={cn(
                "group flex items-center gap-3 p-4 bg-card hover:bg-card/80 rounded-xl border shadow-sm transition-all duration-300",
                todo.completed ? "border-border/20 bg-opacity-50" : "border-border/50"
              )}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleTodo(todo.id)}
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                  todo.completed ? 'bg-primary border-primary' : 'border-muted-foreground/30 hover:border-primary/50'
                )}
              >
                <CheckCircle2 className={cn(
                  "w-5 h-5 transition-all duration-300",
                  todo.completed ? 'text-white scale-100' : 'scale-0'
                )} />
              </motion.button>
              
              <div className="flex-1">
                <div className={cn(
                  "text-lg transition-all duration-300",
                  todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                )}>
                  {todo.text}
                </div>
                
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    PRIORITY_COLORS[todo.priority]
                  )}>
                    {todo.priority}
                  </Badge>
                  
                  {todo.dueDate && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(todo.dueDate, 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTodos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">
              {filter === 'all' 
                ? "Your task list is empty" 
                : filter === 'active'
                ? "No active tasks"
                : "No completed tasks"}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {filter === 'all' 
                ? "Add a new task to get started" 
                : filter === 'active'
                ? "All tasks are completed!"
                : "Complete some tasks to see them here"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}