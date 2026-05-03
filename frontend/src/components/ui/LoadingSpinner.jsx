import React from 'react'
import { cn } from './cn'

const sizes = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

const tones = {
  current: 'border-current border-t-transparent',
  primary: 'border-primary-200 border-t-primary-600',
  white: 'border-white/40 border-t-white',
}

export default function LoadingSpinner({ size = 'md', tone = 'current', className }) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full',
        sizes[size],
        tones[tone],
        className
      )}
      aria-hidden="true"
    />
  )
}
