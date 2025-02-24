import { cn } from "@/lib/utils"

export function TodoSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-32 bg-muted rounded-lg" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-muted rounded-lg" />
          <div className="h-8 w-8 bg-muted rounded-lg" />
          <div className="h-8 w-8 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="flex gap-4">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-4 w-1 bg-muted rounded" />
        <div className="h-4 w-24 bg-muted rounded" />
      </div>

      {/* Search and Input Skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-full bg-muted rounded-lg" />
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-muted rounded-lg" />
          <div className="h-10 w-[110px] bg-muted rounded-lg" />
          <div className="h-10 w-[100px] bg-muted rounded-lg" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Filter Buttons Skeleton */}
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-muted rounded" />
        <div className="h-8 w-16 bg-muted rounded" />
        <div className="h-8 w-16 bg-muted rounded" />
      </div>

      {/* Todo Items Skeleton */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg bg-card",
            "animate-pulse"
          )}
        >
          <div className="h-5 w-5 bg-muted rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/4 bg-muted rounded" />
          </div>
          <div className="h-8 w-8 bg-muted rounded-lg" />
        </div>
      ))}
    </div>
  )
}