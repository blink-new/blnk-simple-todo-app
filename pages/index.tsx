import { TodoList } from '@/components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#0B0F17]">
      <TodoList />
    </main>
  );
}