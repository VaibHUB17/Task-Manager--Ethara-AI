import React from 'react'
import Shimmer from './Shimmer'
import { cn } from './cn'

const variants = {
  default: 'border border-dark-100 bg-white shadow-card',
  elevated: 'bg-white shadow-float',
  outlined: 'border border-dark-200 bg-white',
  flat: 'bg-white/80',
}

export default function Card({
  children,
  className,
  variant = 'default',
  clickable = false,
  loading = false,
}) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-5 transition duration-300',
        clickable && 'cursor-pointer hover:-translate-y-1 hover:shadow-float',
        variants[variant],
        className
      )}
    >
      {children}
      {loading && (
        <div className="absolute inset-0 rounded-2xl bg-white/70 p-5">
          <Shimmer variant="card" className="h-full w-full" />
        </div>
      )}
    </div>
  )
}
