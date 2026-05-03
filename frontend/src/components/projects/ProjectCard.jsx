import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Button, Card, ProgressBar } from '../ui'
import { AuthContext } from '../../context/AuthContext'
import { notify } from '../ui'

export default function ProjectCard({ project }){
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const members = project.members || []
  const progress = Math.min(100, Math.max(8, (project.completedTasks || 0) * 10))

  const viewDetails = () => {
    if (user?.role !== 'admin') {
      notify('error', 'You cannot view project details as a member')
      return
    }
    navigate(`/projects/${project._id}`)
  }

  return (
    <Card clickable className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-dark-900">{project.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-dark-500">{project.description || 'No description provided.'}</p>
        </div>
        <Badge variant="in-progress" size="xs">active</Badge>
      </div>

      <div className="flex -space-x-2">
        {members.slice(0, 4).map((member) => (
          <Avatar key={member._id} name={member.name} size="sm" className="ring-2 ring-white" />
        ))}
        {members.length > 4 && <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-dark-100 text-xs text-dark-600 ring-2 ring-white">+{members.length - 4}</span>}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-dark-500">
          <span>Task progress</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <Button variant="secondary" size="sm" onClick={viewDetails}>View Details</Button>
    </Card>
  )
}
