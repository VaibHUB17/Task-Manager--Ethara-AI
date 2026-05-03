import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/layout/PrivateRoute'
import PageLayout from './components/layout/PageLayout'
import ProjectList from './components/projects/ProjectList'
import ProjectDetails from './components/projects/ProjectDetails'
import TaskList from './components/tasks/TaskList'
import CreateTask from './components/tasks/CreateTask'
import TaskDetails from './components/tasks/TaskDetails'

export default function App(){
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/projects" element={<PrivateRoute><ProjectList/></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails/></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><TaskList/></PrivateRoute>} />
        <Route path="/tasks/create" element={<PrivateRoute><CreateTask/></PrivateRoute>} />
        <Route path="/tasks/:id" element={<PrivateRoute><TaskDetails/></PrivateRoute>} />
      </Routes>
    </PageLayout>
  )
}
