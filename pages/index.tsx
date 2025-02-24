import { TodoList } from '@/components/TodoList';
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#0B0F17]">
      <TodoList />
      <Toaster />
    </main>
  );
}