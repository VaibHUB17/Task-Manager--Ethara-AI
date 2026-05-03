import React from 'react'
import { motion } from 'framer-motion'
import { cn } from './cn'

export default function ProgressBar({ value = 0, className, tone = 'primary' }) {
  const toneClass = tone === 'success' ? 'bg-success' : 'bg-primary-500'

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-dark-100', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn('h-full rounded-full', toneClass)}
      />
    </div>
  )
}
