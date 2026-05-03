import React from 'react'
import Shimmer from '../ui/Shimmer'

export default function TableSkeleton({ rows = 8, columns = 4 }) {
  return (
    <div className="surface overflow-hidden p-4">
      <div className="mb-3 grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, idx) => (
          <Shimmer key={idx} variant="text" className="h-3 w-2/3" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid gap-4 border-t border-dark-100 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, col) => (
            <Shimmer key={col} variant="text" className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
