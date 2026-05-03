import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Card from '../ui/Card'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function PrivateRoute({ children }){
  const { user, loading } = useContext(AuthContext)
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Card className="inline-flex items-center gap-3 px-6 py-4 text-dark-700">
          <LoadingSpinner tone="primary" size="sm" />
          <span>Loading workspace...</span>
        </Card>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}
