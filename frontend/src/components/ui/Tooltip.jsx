import React from 'react'

export default function Tooltip({ text, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 z-40 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-dark-900 px-2 py-1 text-xs text-white group-hover:block">
        {text}
      </span>
    </span>
  )
}
