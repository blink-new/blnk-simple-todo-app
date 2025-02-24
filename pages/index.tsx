import { TodoList } from '@/components/TodoList';
import { Toaster } from "@/components/ui/toaster";
import { useThemeStore } from '@/lib/stores/theme-store';
import { useEffect } from 'react';

export default function Home() {
  const { colors, initTheme } = useThemeStore();
  
  useEffect(() => {
    // Initialize theme on mount
    initTheme();
  }, [initTheme]);

  return (
    <main 
      className="min-h-screen p-4 md:p-8 transition-colors duration-200" 
      style={{ background: colors.background }}
    >
      <TodoList />
      <Toaster />
    </main>
  );
}