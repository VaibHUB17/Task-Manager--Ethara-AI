import React from 'react'
import Shimmer from '../ui/Shimmer'

export default function ProjectCardSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="surface space-y-3 p-5">
          <Shimmer variant="circle" size={2.5} />
          <Shimmer variant="text" className="h-5 w-2/3" />
          <Shimmer variant="text" className="h-4 w-full" />
          <Shimmer variant="text" className="h-4 w-3/4" />
          <Shimmer variant="text" className="h-8 w-28 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
