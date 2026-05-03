import React, { useEffect, useState } from 'react'
import projectService from '../../services/projectService'
import ProjectCard from './ProjectCard'
import CreateProject from './CreateProject'
import Header from '../layout/Header'
import ProjectCardSkeleton from '../loaders/ProjectCardSkeleton'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'
import { IoFolderOpenOutline } from 'react-icons/io5'

export default function ProjectList(){
  const [projects,setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const load = ()=> projectService.getAll().then(setProjects).catch(()=>{}).finally(() => setTimeout(() => setLoading(false), 320))

  useEffect(()=>{ load() },[])

  return (
    <div className="space-y-6">
      <Header
        title="Projects"
        subtitle="Organize teamwork across all active initiatives"
        actions={<Button variant="ghost" size="sm">Grid View</Button>}
      />

      <CreateProject onCreate={load} />

      {loading ? (
        <ProjectCardSkeleton />
      ) : projects.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map(p=> <ProjectCard key={p._id} project={p} />)}
        </div>
      ) : (
        <EmptyState
          icon={<IoFolderOpenOutline className="h-8 w-8" />}
          title="No projects yet"
          description="Start by creating your first project to assign tasks and collaborate with your team."
        />
      )}
    </div>
  )
}
