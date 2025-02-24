import { TodoList } from '../components/TodoList'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <TodoList />
    </main>
  )
}