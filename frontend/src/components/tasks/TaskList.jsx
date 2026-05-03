import React, { useEffect, useState } from 'react'
import taskService from '../../services/taskService'
import TaskCard from './TaskCard'
import { Link } from 'react-router-dom'
import Header from '../layout/Header'
import Button from '../ui/Button'
import Input from '../ui/Input'
import EmptyState from '../ui/EmptyState'
import TaskListSkeleton from '../loaders/TaskListSkeleton'
import { IoAddCircleOutline, IoListOutline, IoGridOutline, IoCheckboxOutline } from 'react-icons/io5'

export default function TaskList(){
  const [tasks,setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)
  const [view, setView] = useState('grid')

  const load = ()=> taskService.getAll().then(setTasks).catch(()=>{}).finally(() => setTimeout(() => setLoading(false), 280))

  useEffect(()=>{ load() },[])

  const filtered = tasks.filter((task) => {
    const matchesQuery = task.title?.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === 'all' ? true : task.status === status
    const matchesOverdue = showOverdueOnly ? task.isOverdue : true
    return matchesQuery && matchesStatus && matchesOverdue
  })

  return (
    <div className="space-y-6">
      <Header
        title="Tasks"
        subtitle="Manage priorities and execution across the team"
        actions={
          <Link to="/tasks/create">
            <Button icon={<IoAddCircleOutline className="h-4 w-4" />}>Create Task</Button>
          </Link>
        }
      />

      <div className="surface grid gap-3 p-4 md:grid-cols-[1fr,180px,140px,auto]">
        <Input
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="focus-ring h-10 rounded-xl border border-dark-200 bg-white px-3 text-sm"
        >
          <option value="all">All status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="in-review">In Review</option>
          <option value="completed">Completed</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-3 h-10 cursor-pointer hover:bg-dark-50">
          <input 
            type="checkbox" 
            checked={showOverdueOnly}
            onChange={(e) => setShowOverdueOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Overdue only</span>
        </label>
        <div className="inline-flex rounded-xl border border-dark-200 bg-white p-1">
          <Button variant={view === 'grid' ? 'primary' : 'ghost'} size="xs" icon={<IoGridOutline className="h-4 w-4" />} onClick={() => setView('grid')}>
            Grid
          </Button>
          <Button variant={view === 'list' ? 'primary' : 'ghost'} size="xs" icon={<IoListOutline className="h-4 w-4" />} onClick={() => setView('list')}>
            List
          </Button>
        </div>
      </div>

      {loading ? (
        <TaskListSkeleton rows={10} />
      ) : filtered.length ? (
        <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
          {filtered.map(t=> <TaskCard key={t._id} task={t} onChange={load} />)}
        </div>
      ) : (
        <EmptyState
          icon={<IoCheckboxOutline className="h-8 w-8" />}
          title="No tasks match your filters"
          description="Try adjusting search or status filters to find what you need."
          action={<Button variant="secondary" onClick={() => { setQuery(''); setStatus('all') }}>Clear filters</Button>}
        />
      )}
    </div>
  )
}
