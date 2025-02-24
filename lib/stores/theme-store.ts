import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { lightTheme, darkTheme, Theme } from '../theme'

interface ThemeState {
  theme: 'light' | 'dark'
  colors: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      colors: darkTheme,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
          colors: state.theme === 'light' ? darkTheme : lightTheme,
        })),
    }),
    {
      name: 'theme-storage',
    }
  )
)