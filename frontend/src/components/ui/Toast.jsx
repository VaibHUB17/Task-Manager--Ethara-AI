import React from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoWarning } from 'react-icons/io5'

const iconMap = {
  success: <IoCheckmarkCircle className="h-5 w-5 text-success" />,
  error: <IoCloseCircle className="h-5 w-5 text-error" />,
  warning: <IoWarning className="h-5 w-5 text-warning" />,
  info: <IoInformationCircle className="h-5 w-5 text-info" />,
}

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          color: '#0f172a',
        },
      }}
    />
  )
}

export function notify(type, message) {
  const icon = iconMap[type] || iconMap.info
  const fn = toast[type] || toast
  fn(message, { icon })
}
