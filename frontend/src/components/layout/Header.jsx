import React from 'react'
import { motion } from 'framer-motion'

export default function Header({ title, subtitle, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-dark-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-dark-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  )
}
