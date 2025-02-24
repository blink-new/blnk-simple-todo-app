import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Todo, TodoPriority } from './types'

interface TodoState {
  todos: Todo[]
  addTodo: (text: string, category?: string, dueDate?: Date, priority?: TodoPriority) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  reorderTodos: (fromIndex: number, toIndex: number) => void
  bulkDeleteTodos: (ids: string[]) => void
  bulkUpdateTodos: (ids: string[], updates: Partial<Todo>) => void
  undoableStates: Todo[][]
  currentStateIndex: number
  pushUndoState: () => void
  undo: () => void
  redo: () => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      undoableStates: [],
      currentStateIndex: -1,

      pushUndoState: () => {
        const { todos, undoableStates, currentStateIndex } = get()
        set({
          undoableStates: [...undoableStates.slice(0, currentStateIndex + 1), [...todos]],
          currentStateIndex: currentStateIndex + 1
        })
      },

      undo: () => {
        const { currentStateIndex, undoableStates } = get()
        if (currentStateIndex > 0) {
          set({
            todos: [...undoableStates[currentStateIndex - 1]],
            currentStateIndex: currentStateIndex - 1
          })
        }
      },

      redo: () => {
        const { currentStateIndex, undoableStates } = get()
        if (currentStateIndex < undoableStates.length - 1) {
          set({
            todos: [...undoableStates[currentStateIndex + 1]],
            currentStateIndex: currentStateIndex + 1
          })
        }
      },

      addTodo: (text, category = 'default', dueDate, priority = 'medium') => {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          category,
          priority,
          dueDate,
          createdAt: new Date(),
          description: '',
          subtasks: [],
          comments: []
        }
        set((state) => {
          const newState = { todos: [newTodo, ...state.todos] }
          state.pushUndoState()
          return newState
        })
      },

      toggleTodo: (id) => {
        set((state) => {
          const newState = {
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          }
          state.pushUndoState()
          return newState
        })
      },

      deleteTodo: (id) => {
        set((state) => {
          const newState = {
            todos: state.todos.filter((todo) => todo.id !== id),
          }
          state.pushUndoState()
          return newState
        })
      },

      updateTodo: (id, updates) => {
        set((state) => {
          const newState = {
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, ...updates } : todo
            ),
          }
          state.pushUndoState()
          return newState
        })
      },

      reorderTodos: (fromIndex, toIndex) => {
        set((state) => {
          const newTodos = [...state.todos]
          const [removed] = newTodos.splice(fromIndex, 1)
          newTodos.splice(toIndex, 0, removed)
          const newState = { todos: newTodos }
          state.pushUndoState()
          return newState
        })
      },

      bulkDeleteTodos: (ids) => {
        set((state) => {
          const newState = {
            todos: state.todos.filter((todo) => !ids.includes(todo.id)),
          }
          state.pushUndoState()
          return newState
        })
      },

      bulkUpdateTodos: (ids, updates) => {
        set((state) => {
          const newState = {
            todos: state.todos.map((todo) =>
              ids.includes(todo.id) ? { ...todo, ...updates } : todo
            ),
          }
          state.pushUndoState()
          return newState
        })
      },
    }),
    {
      name: 'todo-storage',
      partialize: (state) => ({ todos: state.todos }),
    }
  )
)