import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import { cn } from './cn'

const variants = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-soft hover:brightness-110 active:brightness-95',
  secondary:
    'border border-dark-200 bg-white text-dark-700 hover:bg-dark-50',
  ghost: 'text-dark-700 hover:bg-dark-100/70',
  danger: 'bg-error text-white hover:brightness-110 active:brightness-95',
  success: 'bg-success text-white hover:brightness-110 active:brightness-95',
}

const sizes = {
  xs: 'h-8 px-2.5 text-xs',
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
  xl: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0',
}

export default function Button({
  className,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200',
        'hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" tone={variant === 'secondary' || variant === 'ghost' ? 'primary' : 'white'} /> : icon}
      {children}
      {iconRight}
    </button>
  )
}
