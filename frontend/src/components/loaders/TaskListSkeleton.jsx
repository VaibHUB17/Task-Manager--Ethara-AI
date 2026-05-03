import React from 'react'
import Shimmer from '../ui/Shimmer'

export default function TaskListSkeleton({ rows = 10 }) {
  return (
    <div className="surface overflow-hidden p-4">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 border-b border-dark-100 py-3 last:border-0">
          <Shimmer variant="circle" size={2.2} />
          <div className="flex-1 space-y-2">
            <Shimmer variant="text" className="h-4 w-1/2" />
            <Shimmer variant="text" className="h-3 w-2/3" />
          </div>
          <Shimmer variant="text" className="h-7 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}
