import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface ProgressBarProps {
  total: number
  completed: number
}

export function ProgressBar({ total, completed }: ProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    const percentage = total === 0 ? 0 : (completed / total) * 100
    setProgress(percentage)
    
    // Show celebration when all tasks are completed
    if (total > 0 && completed === total) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [total, completed])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress 
        value={progress} 
        className={cn(
          "h-2 transition-all duration-500",
          progress === 100 && "bg-gradient-to-r from-green-500 to-emerald-500"
        )} 
      />
      {showCelebration && (
        <>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
          <div className="animate-bounce text-center mt-4 text-lg font-medium text-green-500">
            🎉 All tasks completed! 🎉
          </div>
        </>
      )}
    </div>
  )
}