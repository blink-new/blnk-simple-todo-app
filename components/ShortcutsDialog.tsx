import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useShortcutsStore } from "@/lib/stores/shortcuts-store"

export function ShortcutsDialog() {
  const { isOpen, setIsOpen } = useShortcutsStore()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              /
            </kbd>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Focus search
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              ⌘ + K
            </kbd>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Open command palette
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              ⌘ + Z
            </kbd>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Undo last action
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              ⌘ + ⇧ + Z
            </kbd>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Redo last action
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              ⌘ + D
            </kbd>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Toggle dark mode
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              ⌘ + Enter
            </kbd>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Add new task
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}