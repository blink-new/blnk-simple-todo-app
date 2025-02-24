import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, X, Edit2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

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
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }])
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

  const updateTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
    setEditingId(null)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-8">
        My Tasks
      </h1>
      
      <div className="flex gap-2 mb-8">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button onClick={addTodo} className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <AnimatePresence>
        {todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 dark:text-gray-400 mt-8"
          >
            No tasks yet. Add one to get started!
          </motion.div>
        ) : (
          <div className="space-y-3">
            {todos.map(todo => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleTodo(todo.id)}
                  className={`${todo.completed ? 'text-emerald-500' : 'text-gray-400'}`}
                >
                  <Check className="w-5 h-5" />
                </Button>

                {editingId === todo.id ? (
                  <Input
                    defaultValue={todo.text}
                    onBlur={(e) => updateTodo(todo.id, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateTodo(todo.id, e.currentTarget.value)}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-1 ${
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                )}

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(todo.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}