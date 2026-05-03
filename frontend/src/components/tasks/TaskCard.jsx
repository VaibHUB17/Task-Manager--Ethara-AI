import React, { useContext } from 'react'
import taskService from '../../services/taskService'
import confetti from 'canvas-confetti'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, notify } from '../ui'
import { AuthContext } from '../../context/AuthContext'
import { IoCheckmarkCircleOutline, IoArrowBackCircleOutline, IoEyeOutline } from 'react-icons/io5'

export default function TaskCard({ task, onChange }) {
  const { user } = useContext(AuthContext)

  const updateStatus = async (nextStatus) => {
    try {
      await taskService.updateStatus(task._id, nextStatus)
      if (nextStatus === 'completed') {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
        })
        notify('success', 'Task completed!')
      } else {
        notify('success', `Status updated to ${nextStatus.replace('-', ' ')}`)
      }
      if (onChange) onChange()
    } catch (error) {
      notify('error', 'Failed to update task status')
    }
  }

  const formatDate = (date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const due = new Date(dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  }

  const canEditTask = user?.role === 'admin' || task.assignedTo?._id === user?._id
  const isCompleted = task.status === 'completed'

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden p-5 transition-all hover:shadow-md">
      <div className="space-y-4">
        {/* Header: Title and Status Badge */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-lg font-bold leading-tight text-dark-900 group-hover:text-blue-600">
            {task.title}
          </h3>
          <Badge variant={task.status || 'todo'} size="sm" dot className="shrink-0" />
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-dark-500">
          {task.description || 'No description provided.'}
        </p>

        {/* Metadata: Priority and Assignee */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={task.priority || 'medium'} size="xs" className="uppercase tracking-wider" />
          <div className="h-1 w-1 rounded-full bg-dark-200" />
          <span className="text-xs font-medium text-dark-600">
            {task.assignedTo?.name || 'Unassigned'}
          </span>
        </div>

        {/* Due Date Info */}
        {task.dueDate && (
          <div className="flex items-center gap-2 text-xs text-dark-500">
            <span className={task.isOverdue ? 'text-red-500 font-bold' : ''}>
              Due {formatDate(task.dueDate)}
            </span>
            {!isCompleted && !task.isOverdue && getDaysUntilDue(task.dueDate) <= 3 && (
              <span className="rounded-full bg-orange-50 px-2 py-0.5 font-semibold text-orange-600">
                {getDaysUntilDue(task.dueDate)} days left
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex items-center justify-between border-t border-dark-100 pt-4">
        <div className="flex gap-2">
          {canEditTask && (
            <Button
              onClick={() => updateStatus(isCompleted ? 'in-progress' : 'completed')}
              variant={isCompleted ? 'outline' : 'success'}
              size="sm"
              className="gap-2"
            >
              {isCompleted ? (
                <>
                  <IoArrowBackCircleOutline className="h-4 w-4" /> Reopen
                </>
              ) : (
                <>
                  <IoCheckmarkCircleOutline className="h-4 w-4" /> Complete
                </>
              )}
            </Button>
          )}
        </div>

        <Link to={`/tasks/${task._id}`}>
          <Button variant="ghost" size="sm" className="text-dark-500 hover:text-blue-600">
            <IoEyeOutline className="mr-1 h-4 w-4" /> Details
          </Button>
        </Link>
      </div>
    </Card>
  )
}