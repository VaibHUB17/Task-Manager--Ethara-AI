import React from 'react'
import { cn } from './cn'

const mapByVariant = {
  todo: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'in-review': 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700 animate-pulse-slow',
  overdue: 'bg-red-100 text-red-700 animate-pulse-slow',
}

const sizes = {
  xs: 'px-2 py-1 text-[10px]',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export default function Badge({ variant = 'todo', size = 'sm', dot = false, icon, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium capitalize',
        mapByVariant[variant] || 'bg-slate-100 text-slate-700',
        sizes[size],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {icon}
      {children || String(variant).replace('-', ' ')}
    </span>
  )
}
