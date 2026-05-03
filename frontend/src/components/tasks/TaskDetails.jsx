import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import taskService from '../../services/taskService'
import Header from '../layout/Header'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { notify } from '../ui'
import Shimmer from '../ui/Shimmer'
import { AuthContext } from '../../context/AuthContext'

export default function TaskDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [task,setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useContext(AuthContext)
  const [assigneeEmail, setAssigneeEmail] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(()=>{
    taskService.getById(id)
      .then((result) => {
        setTask(result)
        setError('')
      })
      .catch((err) => {
        const message = err.response?.status === 403
          ? 'You cannot access this task'
          : err.response?.data?.message || 'Failed to load task'

        if (err.response?.status === 403) {
          notify('error', message)
          navigate('/tasks', { replace: true })
          return
        }

        setTask(null)
        setError(message)
      })
      .finally(() => setLoading(false))
  },[id])

  const formatDate = (date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const due = new Date(dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  const canEditTask = user?.role === 'admin' || task?.assignedTo?._id === user?._id

  const updateStatus = async (nextStatus) => {
    setUpdatingStatus(true)
    try {
      await taskService.updateStatus(task._id, nextStatus)
      const fresh = await taskService.getById(task._id)
      setTask(fresh)
      notify('success', `Marked as ${nextStatus.replace('-', ' ')}`)
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to update task')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <Card className="max-w-3xl">
        <Shimmer variant="text" className="mb-3 h-8 w-1/2" />
        <Shimmer variant="text" className="h-4 w-full" />
      </Card>
    )
  }

  if (error || !task) {
    return (
      <Card className="max-w-3xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-dark-900">Task unavailable</h1>
        <p className="mt-2 text-dark-600">{error || 'We could not load this task.'}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Header title="Task Details" subtitle="Inspect and track individual work item progress" />
      <Card className="max-w-3xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-dark-900">{task.title}</h1>
        <p className="mt-2 text-dark-600">{task.description || 'No description provided.'}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant={task.status || 'todo'} dot />
          <Badge variant={task.priority || 'medium'} />
          {task.isOverdue && <Badge variant="overdue">Overdue</Badge>}
        </div>
        {canEditTask && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-dark-700">Update status</p>
            <div className="flex flex-wrap gap-2">
              <Button loading={updatingStatus} onClick={() => updateStatus('todo')} variant={task.status === 'todo' ? 'primary' : 'secondary'} size="sm">
                Todo
              </Button>
              <Button loading={updatingStatus} onClick={() => updateStatus('in-progress')} variant={task.status === 'in-progress' ? 'primary' : 'secondary'} size="sm">
                In Progress
              </Button>
              <Button loading={updatingStatus} onClick={() => updateStatus('in-review')} variant={task.status === 'in-review' ? 'primary' : 'secondary'} size="sm">
                In Review
              </Button>
              <Button loading={updatingStatus} onClick={() => updateStatus('completed')} variant="success" size="sm">
                Completed
              </Button>
            </div>
          </div>
        )}
      </Card>
      <Card className="max-w-3xl">
        <h3 className="font-display text-lg font-semibold text-dark-900">Additional Details</h3>
        <div className="mt-3 space-y-1.5 text-sm text-dark-600">
          <p>Status: <span className="font-medium">{task.status}</span></p>
          <p>Priority: <span className="font-medium">{task.priority}</span></p>
          <p>Assigned To: <span className="font-medium">{task.assignedTo?.name || 'Unassigned'}</span></p>
          {task.dueDate && (
            <>
              <p>Due Date: <span className="font-medium">{formatDate(task.dueDate)}</span></p>
              {task.isOverdue && <p className="text-red-600 font-medium">This task is overdue!</p>}
              {!task.isOverdue && getDaysUntilDue(task.dueDate) !== null && (
                <p className={getDaysUntilDue(task.dueDate) <= 3 ? 'text-orange-600 font-medium' : ''}>
                  {getDaysUntilDue(task.dueDate)} days remaining
                </p>
              )}
            </>
          )}
        </div>
        {user?.role === 'admin' && (
          <div className="mt-4 pt-3 border-t">
            <h4 className="font-medium text-dark-800">Assign by Email</h4>
            <div className="mt-2 flex gap-2">
              <Input placeholder="member@example.com" value={assigneeEmail} onChange={e=>setAssigneeEmail(e.target.value)} />
              <Button loading={assigning} onClick={async ()=>{
                if (!assigneeEmail) return notify('error','Enter an email')
                setAssigning(true)
                try{
                  await taskService.update(id, { assignedToEmail: assigneeEmail })
                  const fresh = await taskService.getById(id)
                  setTask(fresh)
                  notify('success','Assignee updated')
                  setAssigneeEmail('')
                }catch(err){
                  notify('error', err.response?.data?.message || 'Failed to assign')
                }finally{ setAssigning(false) }
              }}>
                Assign
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
