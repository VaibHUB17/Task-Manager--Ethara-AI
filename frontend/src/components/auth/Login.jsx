import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { AuthContext } from '../../context/AuthContext'
import { Button, Card, Input, notify } from '../ui'
import FadeIn from '../animations/FadeIn'
import { Link } from 'react-router-dom'
import { IoLogInOutline, IoPersonAddOutline } from 'react-icons/io5'

export default function Login(){
  const { setUser } = useContext(AuthContext)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try{
      const res = await api.post('/auth/login',{ email, password })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      notify('success', 'Welcome back!')
      navigate('/')
    }catch(err){
      setError(err.response?.data?.message || 'Login error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FadeIn>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Link to="/login" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-primary-50 text-primary-700">
            <IoLogInOutline className="h-4 w-4" /> Login
          </Link>
          <Link to="/signup" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium hover:bg-dark-50">
            <IoPersonAddOutline className="h-4 w-4" /> Sign up
          </Link>
        </div>

        <Card className="p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-dark-900">Welcome back</h2>
        <p className="mb-5 mt-1 text-sm text-dark-500">Sign in to continue managing your team tasks.</p>
        <form onSubmit={submit} className="space-y-3">
          <Input label="Email" placeholder="admin1@example.com" value={email} onChange={e=>{ setEmail(e.target.value); if (error) setError(null) }} error={error} />
          <Input type="password" label="Password" placeholder="Enter password" value={password} onChange={e=>{ setPassword(e.target.value); if (error) setError(null) }} />
          <Button className="w-full" loading={submitting}>Login</Button>
        </form>
        </Card>

        <div className="mt-3 text-center text-sm text-dark-500">
          Don’t have an account? <Link to="/signup" className="font-medium text-primary-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </FadeIn>
  )
}
