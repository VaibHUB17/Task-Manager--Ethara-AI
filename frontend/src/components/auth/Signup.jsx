import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { AuthContext } from '../../context/AuthContext'
import { Button, Card, Input, notify } from '../ui'
import FadeIn from '../animations/FadeIn'
import { Link } from 'react-router-dom'
import { IoPersonAddOutline, IoLogInOutline } from 'react-icons/io5'

export default function Signup(){
  const { setUser } = useContext(AuthContext)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [role,setRole] = useState('member')
  const [error,setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try{
      const res = await api.post('/auth/signup',{ name, email, password, role })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      notify('success', 'Account created successfully')
      navigate('/')
    }catch(err){
      setError(err.response?.data?.message || 'Signup error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FadeIn>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Link to="/signup" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-primary-50 text-primary-700">
            <IoPersonAddOutline className="h-4 w-4" /> Sign up
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium hover:bg-dark-50">
            <IoLogInOutline className="h-4 w-4" /> Login
          </Link>
        </div>

        <Card className="p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-dark-900">Create account</h2>
          <p className="mb-5 mt-1 text-sm text-dark-500">Start collaborating with your team in minutes.</p>
          <form onSubmit={submit} className="space-y-3">
            <Input label="Name" placeholder="Aarav Admin" value={name} onChange={e=>setName(e.target.value)} error={error} />
            <Input label="Email" placeholder="admin1@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <Input type="password" label="Password" placeholder="Create password" value={password} onChange={e=>setPassword(e.target.value)} />
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-dark-700">Role</span>
              <select className="focus-ring h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-dark-900" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <Button className="w-full" variant="success" loading={submitting}>Sign Up</Button>
          </form>
        </Card>

        <div className="mt-3 text-center text-sm text-dark-500">
          Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline">Login</Link>
        </div>
      </div>
    </FadeIn>
  )
}
