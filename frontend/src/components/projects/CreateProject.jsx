import React, { useState } from 'react'
import projectService from '../../services/projectService'
import { Button, Card, Input, notify } from '../ui'

export default function CreateProject({ onCreate }){
  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  const [error,setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try{
      await projectService.create({ name, description })
      setName(''); setDescription(''); setError(null)
      notify('success', 'Project created')
      if (onCreate) onCreate()
    }catch(err){
      setError(err.response?.data?.message || 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-3">
        <h3 className="font-display text-lg font-semibold text-dark-900">Create Project</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Name" placeholder="Website Revamp" value={name} onChange={e=>setName(e.target.value)} error={error} />
          <Input label="Description" placeholder="Redesign client portal UI" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <Button loading={submitting}>Create</Button>
      </form>
    </Card>
  )
}
