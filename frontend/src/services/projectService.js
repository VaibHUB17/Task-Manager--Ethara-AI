import api from './api'

export default {
  getAll: (params) => api.get('/projects', { params }).then(r=>r.data),
  create: (payload) => api.post('/projects', payload).then(r=>r.data),
  getById: (id) => api.get(`/projects/${id}`).then(r=>r.data),
  addMember: (id, userId) => api.post(`/projects/${id}/members`, { userId }).then(r=>r.data),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`).then(r=>r.data),
}
