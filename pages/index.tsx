import { TodoList } from '@/components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <TodoList />
    </main>
  );
}