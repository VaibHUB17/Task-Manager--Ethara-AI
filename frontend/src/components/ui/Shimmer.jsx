import React from 'react'
import { cn } from './cn'

const variants = {
  text: 'h-4 rounded-md',
  circle: 'rounded-full',
  rectangle: 'rounded-lg',
  card: 'rounded-xl',
  avatar: 'h-10 w-10 rounded-full',
}

export default function Shimmer({
  variant = 'text',
  width = '100%',
  height,
  size,
  className,
}) {
  const style = {
    width: size ? `${size}rem` : width,
    height: size ? `${size}rem` : height,
  }

  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:1000px_100%]',
        variants[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  )
}
