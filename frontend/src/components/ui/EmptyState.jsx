import React from 'react'
import { motion } from 'framer-motion'

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface flex flex-col items-center justify-center gap-3 border-dashed px-6 py-12 text-center"
    >
      {icon && <div className="rounded-full bg-primary-50 p-4 text-primary-600">{icon}</div>}
      <h3 className="font-display text-xl font-semibold text-dark-900">{title}</h3>
      <p className="max-w-md text-sm text-dark-500">{description}</p>
      {action}
    </motion.div>
  )
}
