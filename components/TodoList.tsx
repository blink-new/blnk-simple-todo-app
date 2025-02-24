import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    setTodos([...todos, {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false
    }])
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

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-primary">Tasks</h1>
      
      <form onSubmit={addTodo} className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </form>

      <AnimatePresence mode="popLayout">
        {todos.map(todo => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center gap-3 bg-card p-4 rounded-lg shadow-sm"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center
                ${todo.completed ? 'bg-primary border-primary' : 'border-gray-300'}`}
            >
              {todo.completed && <CheckIcon className="h-4 w-4 text-white" />}
            </button>
            
            <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
              {todo.text}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {todos.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground"
        >
          No tasks yet. Add one above!
        </motion.p>
      )}
    </div>
  )
}