import React from 'react'
import { motion } from 'framer-motion'

export default function FadeIn({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
