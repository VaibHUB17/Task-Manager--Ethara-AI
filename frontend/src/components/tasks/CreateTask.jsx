import React, { useEffect, useState, useContext } from 'react'
import taskService from '../../services/taskService'
import projectService from '../../services/projectService'
import { useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { notify } from '../ui'
import { AuthContext } from '../../context/AuthContext'

export default function CreateTask(){
  const { user } = useContext(AuthContext)
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [project,setProject] = useState('')
  const [projects,setProjects] = useState([])
  const [priority,setPriority] = useState('medium')
  const [dueDate,setDueDate] = useState('')
  const [assigneeEmail, setAssigneeEmail] = useState('')
  const [assignToMe, setAssignToMe] = useState(false)
  const [error,setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{ projectService.getAll().then(setProjects).catch(()=>{}) },[])

  const submit = async e => {
    e.preventDefault()
    if (!project) {
      setError('Please select a project before creating a task.')
      return
    }
    setSubmitting(true)
    try{
      const payload = { title, description, project, priority, dueDate: dueDate || undefined }
      if (user?.role === 'admin') {
        if (assigneeEmail) payload.assignedToEmail = assigneeEmail
      } else if (assignToMe && user?._id) {
        payload.assignedTo = user._id
      }
      await taskService.create(payload)
      notify('success', 'Task created successfully')
      navigate('/tasks')
    }catch(err){
      setError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Header title="Create Task" subtitle="Capture clear work items with owner and priority" />
      <Card className="w-full max-w-3xl">
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input required minLength={3} value={title} onChange={e=>setTitle(e.target.value)} label="Title" placeholder="Create login page" className="sm:col-span-2" error={error} />
            <label className="space-y-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-dark-700">Description</span>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Build responsive login screen" className="focus-ring min-h-24 w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-dark-900 placeholder:text-dark-400" />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-dark-700">Project</span>
              <select required value={project} onChange={e=>{ setProject(e.target.value); if (error) setError('') }} className="focus-ring h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-dark-900">
                <option value="">Select project</option>
                {projects.map(p=> <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-dark-700">Priority</span>
              <select value={priority} onChange={e=>setPriority(e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-dark-900">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-dark-700">Due Date</span>
              <input 
                type="date" 
                value={dueDate} 
                onChange={e=>setDueDate(e.target.value)} 
                className="focus-ring h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-dark-900"
              />
            </label>
            {user?.role === 'admin' ? (
              <Input
                label="Assignee Email (optional)"
                placeholder="member@example.com"
                value={assigneeEmail}
                onChange={e=>setAssigneeEmail(e.target.value)}
                className="sm:col-span-2"
              />
            ) : (
              <label className="flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-3 py-3 text-sm text-dark-700 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={assignToMe}
                  onChange={(e) => setAssignToMe(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Assign to me</span>
                <span className="text-dark-500">Leave unchecked to create it unassigned.</span>
              </label>
            )}
          </div>
          <Button loading={submitting}>Create Task</Button>
        </form>
      </Card>
    </div>
  )
}
