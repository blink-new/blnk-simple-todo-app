import { TodoList } from '@/components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-background to-muted">
      <TodoList />
    </main>
  );
}