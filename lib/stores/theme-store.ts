import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { lightTheme, darkTheme, Theme } from '../theme'

interface ThemeState {
  theme: 'light' | 'dark'
  colors: Theme
  toggleTheme: () => void
  initTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      colors: darkTheme,
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          const newColors = newTheme === 'light' ? lightTheme : darkTheme
          // Immediately update the document class
          document.documentElement.classList.toggle('dark', newTheme === 'dark')
          return {
            theme: newTheme,
            colors: newColors,
          }
        }),
      initTheme: () =>
        set((state) => {
          // Set initial theme based on system preference or stored value
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          const theme = state.theme || systemTheme
          const colors = theme === 'light' ? lightTheme : darkTheme
          // Immediately update the document class
          document.documentElement.classList.toggle('dark', theme === 'dark')
          return {
            theme,
            colors,
          }
        }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // When storage is rehydrated, ensure theme class is set
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark')
        }
      },
    }
  )
)