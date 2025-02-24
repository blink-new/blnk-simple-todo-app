import { create } from 'zustand'

interface ShortcutsState {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleOpen: () => void
}

export const useShortcutsStore = create<ShortcutsState>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}))