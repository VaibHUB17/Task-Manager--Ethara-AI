import React from 'react'
import { cn } from './cn'

export default function Avatar({ src, alt, name, size = 'md', className }) {
  const sizeMap = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const initials = (name || alt || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  if (src) {
    return <img src={src} alt={alt || name || 'User avatar'} className={cn('rounded-full object-cover', sizeMap[size], className)} />
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-700 to-primary-500 font-semibold text-white',
        sizeMap[size],
        className
      )}
      aria-label={alt || name || 'User avatar'}
    >
      {initials}
    </span>
  )
}
