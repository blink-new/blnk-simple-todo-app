import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      setTodos(JSON.parse(saved))
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
    setTodos([...todos, { id: Date.now().toString(), text: newTodo.trim(), completed: false }])
    setNewTodo('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  if (!isLoaded) {
    return (
      <div className="min-h-[400px] max-w-md mx-auto p-8 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your tasks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-[400px] max-w-md mx-auto p-8 rounded-xl bg-gradient-to-b from-background to-background/80 shadow-xl border border-border/50">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-8"
      >
        Tasks
      </motion.h1>

      <form onSubmit={addTodo} className="group flex gap-3 mb-8">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 h-12 px-4 text-lg transition-all border-2 border-transparent focus:border-primary/20 rounded-xl"
        />
        <Button 
          type="submit" 
          size="lg"
          className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </form>

      <motion.div 
        className="space-y-3"
        initial={false}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="popLayout">
          {todos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="group flex items-center gap-3 p-4 bg-card hover:bg-card/80 rounded-xl border border-border/50 shadow-sm transition-all duration-300"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                  ${todo.completed 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground/30 hover:border-primary/50'}`}
              >
                <CheckIcon className={`w-5 h-5 transition-all duration-300 ${
                  todo.completed ? 'text-white scale-100' : 'scale-0'
                }`} />
              </motion.button>
              
              <span className={`flex-1 text-lg transition-all duration-300 ${
                todo.completed 
                  ? 'line-through text-muted-foreground' 
                  : 'text-foreground'
              }`}>
                {todo.text}
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-all duration-300"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-lg text-muted-foreground">
              Your task list is empty
            </p>
            <p className="text-sm text-muted-foreground/70">
              Add a new task to get started
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}