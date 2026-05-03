import React from 'react'
import Shimmer from '../ui/Shimmer'

export default function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="surface p-5">
            <Shimmer variant="text" className="mb-3 h-3 w-24" />
            <Shimmer variant="text" className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="surface p-6">
        <Shimmer variant="card" className="h-48 w-full" />
      </div>
      <div className="surface p-6">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Shimmer key={idx} variant="text" className="mb-3 h-4 w-full last:mb-0" />
        ))}
      </div>
    </div>
  )
}
