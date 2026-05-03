import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import projectService from '../../services/projectService'
import userService from '../../services/userService'
import { AuthContext } from '../../context/AuthContext'
import Header from '../layout/Header'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Shimmer from '../ui/Shimmer'
import { notify } from '../ui'

export default function ProjectDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [project,setProject] = useState(null)
  const [memberId,setMemberId] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const { user, loading: authLoading } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ projectService.getById(id).then(setProject).catch(()=>{}).finally(() => setTimeout(() => setLoading(false), 280)) },[id])

  useEffect(() => {
    if (authLoading) return
    if (user?.role !== 'admin') {
      notify('error', 'You cannot view project details as a member')
      navigate('/projects', { replace: true })
    }
  }, [authLoading, navigate, user?.role])

  const addMember = async e => {
    e.preventDefault()
    try{
      await projectService.addMember(id, memberId)
      setMemberId('')
      const updated = await projectService.getById(id)
      setProject(updated)
    }catch(err){}
  }

  useEffect(()=>{
    if (!query) { setResults([]); return }
    let cancelled = false
    setSearching(true)
    userService.search(query).then(r=>{ if (!cancelled) setResults(r) }).catch(()=>{ if (!cancelled) setResults([]) }).finally(()=>{ if (!cancelled) setSearching(false) })
    return () => { cancelled = true }
  },[query])

  const handleAddFromResult = async (u) => {
    try{
      await projectService.addMember(id, u._id)
      const updated = await projectService.getById(id)
      setProject(updated)
      setQuery('')
      setResults([])
    }catch(err){ }
  }

  const handleRemoveMember = async (m) => {
    try{
      if (!window.confirm(`Remove ${m.name} from project?`)) return
      await projectService.removeMember(id, m._id)
      const updated = await projectService.getById(id)
      setProject(updated)
    }catch(err){ }
  }

  if (authLoading || loading || !project || user?.role !== 'admin') {
    return (
      <Card>
        <Shimmer variant="text" className="mb-3 h-8 w-1/3" />
        <Shimmer variant="text" className="h-4 w-full" />
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Header title={project.name} subtitle={project.description || 'No description added yet.'} />

      <Card>
        <h3 className="font-display text-lg font-semibold text-dark-900">Members</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {project.members?.map(m=> (
            <li key={m._id} className="flex items-center gap-2 rounded-xl border border-dark-100 px-3 py-2 text-sm text-dark-700">
              <Avatar name={m.name} size="sm" />
              <div>
                <p className="font-medium text-dark-800">{m.name}</p>
                <p className="text-xs text-dark-500">{m.email}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <Badge variant="todo" size="xs">member</Badge>
                {m._id !== project.admin._id && (
                  <Button size="sm" variant="secondary" onClick={()=>handleRemoveMember(m)}>Remove</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="w-full max-w-xl">
        <h4 className="font-display text-lg font-semibold text-dark-900">Add member</h4>
        <div className="space-y-3">
          <Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users by name or email" />
          {searching && <p className="text-sm text-dark-500">Searching...</p>}
          {!searching && results.length === 0 && query && (
            <div className="text-sm text-dark-500">No users found for "{query}". You can try a different query or paste a user id/email above.</div>
          )}
          <ul className="mt-2 space-y-2">
            {results.map(u => (
              <li key={u._id} className="flex items-center gap-2 rounded-xl border border-dark-100 px-3 py-2 text-sm text-dark-700">
                <Avatar name={u.name} size="sm" />
                <div>
                  <p className="font-medium text-dark-800">{u.name}</p>
                  <p className="text-xs text-dark-500">{u.email}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button size="sm" onClick={()=>handleAddFromResult(u)}>Add</Button>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={addMember} className="space-y-3">
            <Input value={memberId} onChange={e=>setMemberId(e.target.value)} placeholder="User ID or email" />
            <Button>Add Member</Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
