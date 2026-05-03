// Simple Node smoke test using built-in fetch (Node 18+)
(async ()=>{
  const base = 'http://localhost:5000/api'
  const signupBody = { name: 'Smoke Tester', email: 'smoke+1@example.com', password: 'Password1', role: 'admin' }
  const signupRes = await fetch(`${base}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(signupBody) })
  const signup = await signupRes.json()
  console.log('--- SIGNUP ---')
  console.log(JSON.stringify(signup))
  const token = signup.token
  if (!token) { console.error('No token received'); process.exit(1) }

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const projectRes = await fetch(`${base}/projects`, { method: 'POST', headers, body: JSON.stringify({ name: 'Smoke Project', description: 'Created by smoke test' }) })
  const project = await projectRes.json()
  console.log('--- PROJECT ---')
  console.log(JSON.stringify(project))

  const taskRes = await fetch(`${base}/tasks`, { method: 'POST', headers, body: JSON.stringify({ title: 'Smoke Task', description: 'Task for smoke test', project: project._id, priority: 'medium' }) })
  const task = await taskRes.json()
  console.log('--- TASK ---')
  console.log(JSON.stringify(task))

  const statsRes = await fetch(`${base}/dashboard/stats`, { headers })
  const stats = await statsRes.json()
  console.log('--- STATS ---')
  console.log(JSON.stringify(stats))

  console.log('SMOKE TEST COMPLETED')
})().catch(err=>{console.error('Smoke test error', err); process.exit(1)})
