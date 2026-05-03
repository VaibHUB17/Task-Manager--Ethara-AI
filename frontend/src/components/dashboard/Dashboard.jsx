import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Header from '../layout/Header'
import DashboardSkeleton from '../loaders/DashboardSkeleton'
import StaggerChildren from '../animations/StaggerChildren'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'
import { 
  IoAddCircleOutline, 
  IoFolderOpenOutline, 
  IoFlashOutline, 
  IoTrendingUpOutline,
  IoTimeOutline
} from 'react-icons/io5'

import { IoCheckmarkCircleOutline, IoEyeOutline, IoAlertCircleOutline } from 'react-icons/io5'

// Enhanced StatCard with icons and hover effects
function StatCard({ label, value, tone = 'text-dark-900', icon: Icon, sublabel }) {
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-dark-400">{label}</p>
          <p className={`mt-2 font-display text-3xl font-bold ${tone}`}>{value}</p>
          {sublabel && <p className="mt-1 text-xs text-dark-500">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`rounded-lg p-2 bg-opacity-10 ${tone.replace('text-', 'bg-')} ${tone}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all([
      api.get('/dashboard/stats').then((r) => r.data).catch(() => null),
      api.get('/dashboard/recent-tasks').then((r) => r.data).catch(() => []),
    ]).then(([statsData, recentData]) => {
      if (!mounted) return
      setStats(statsData)
      setRecentTasks(Array.isArray(recentData) ? recentData : recentData?.tasks || [])
    }).finally(() => {
      if (!mounted) return
      setTimeout(() => setLoading(false), 320)
    })

    return () => { mounted = false }
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <Header
        title="Command Center"
        subtitle="Good morning! Here is what's happening with your projects today."
        actions={
          <div className="flex items-center gap-3">
            <Link to="/tasks/create">
              <Button icon={<IoAddCircleOutline className="h-4 w-4" />}>Quick Task</Button>
            </Link>
            <Link to="/projects">
              <Button variant="secondary" icon={<IoFolderOpenOutline className="h-4 w-4" />}>All Projects</Button>
            </Link>
          </div>
        }
      />

      {!stats ? (
        <EmptyState
          title="Welcome! Create your first project"
          description="Add a project and assign tasks to see dashboard analytics appear here."
          action={<Link to="/projects"><Button>Create project</Button></Link>}
        />
      ) : (
        <>
          {/* Main Stats Grid */}
          <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard label="Total" value={stats.total} tone="text-dark-900" icon={IoFolderOpenOutline} />
            <StatCard label="In Progress" value={stats.inProgress} tone="text-blue-600" icon={IoFlashOutline} />
            <StatCard label="Completed" value={stats.completed} tone="text-emerald-600" icon={IoCheckmarkCircleOutline} />
            <StatCard label="In Review" value={stats.inReview} tone="text-amber-500" icon={IoEyeOutline} />
            <StatCard label="Todo" value={stats.todo} tone="text-slate-500" icon={IoTimeOutline} />
            <StatCard label="Overdue" value={stats.overdue} tone="text-rose-600" icon={IoAlertCircleOutline} />
          </StaggerChildren>

          <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
            {/* Left Column: Progress Insights */}
            <div className="space-y-6">
              <Card className="border-none bg-gradient-to-br from-dark-900 to-dark-800 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold">Productivity Score</h3>
                    <p className="mt-1 text-dark-300">You've completed {stats?.taskProgress?.percent || 0}% of your total goals.</p>
                  </div>
                  <IoTrendingUpOutline className="h-12 w-12 text-emerald-400 opacity-50" />
                </div>
                <div className="mt-8">
                  <ProgressBar
                    value={stats?.taskProgress?.percent || 0}
                    tone="success"
                    className="h-3 bg-white/10"
                  />
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card variant="elevated">
                  <h4 className="text-sm font-bold text-dark-500 uppercase tracking-tighter">Project Velocity</h4>
                  <p className="mt-2 text-2xl font-bold text-dark-900">{stats?.projectProgress?.percent || 0}%</p>
                  <ProgressBar value={stats?.projectProgress?.percent || 0} tone="info" className="mt-4" />
                  <p className="mt-2 text-xs text-dark-400">{stats?.projectProgress?.completed} of {stats?.projectProgress?.total} projects closed</p>
                </Card>

                <Card variant="elevated">
                  <h4 className="text-sm font-bold text-dark-500 uppercase tracking-tighter">Personal Load</h4>
                  <p className="mt-2 text-2xl font-bold text-dark-900">{stats?.assignedTaskProgress?.percent || 0}%</p>
                  <ProgressBar value={stats?.assignedTaskProgress?.percent || 0} tone="warning" className="mt-4" />
                  <p className="mt-2 text-xs text-dark-400">{stats?.assignedTaskProgress?.completed} tasks done</p>
                </Card>
              </div>
            </div>

            {/* Right Column: Recent Activity Feed */}
            <Card className="flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-dark-900">Recent Activity</h3>
                <Link to="/tasks" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {recentTasks.length ? (
                  recentTasks.slice(0, 5).map((task) => (
                    <Link key={task._id} to={`/tasks/${task._id}`} className="block group">
                      <div className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all group-hover:border-dark-100 group-hover:bg-dark-50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-dark-100 text-dark-600 group-hover:bg-white group-hover:text-blue-600">
                          <IoFlashOutline className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-dark-800">{task.title}</p>
                          <div className="flex items-center gap-2">
                             <Badge variant={task.status || 'todo'} size="xs" />
                             <span className="text-[10px] text-dark-400 uppercase font-bold">2h ago</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-dark-400">No activity yet.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}