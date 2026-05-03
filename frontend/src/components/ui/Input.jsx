import React from 'react'
import { cn } from './cn'

export default function Input({ className, error, label, hint, ...props }) {
  return (
    <label className="space-y-1.5 text-sm">
      {label && <span className="font-medium text-dark-700">{label}</span>}
      <input
        className={cn(
          'focus-ring h-11 w-full rounded-xl border bg-white px-3.5 text-dark-900 placeholder:text-dark-400 transition',
          error ? 'border-error/60' : 'border-dark-200',
          className
        )}
        {...props}
      />
      {(error || hint) && <span className={cn('text-xs', error ? 'text-error' : 'text-dark-500')}>{error || hint}</span>}
    </label>
  )
}
