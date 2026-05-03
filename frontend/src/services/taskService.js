import api from './api'

export default {
  getAll: (params) => api.get('/tasks', { params }).then(r=>r.data),
  create: (payload) => api.post('/tasks', payload).then(r=>r.data),
  getById: (id) => api.get(`/tasks/${id}`).then(r=>r.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then(r=>r.data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }).then(r=>r.data),
  remove: (id) => api.delete(`/tasks/${id}`).then(r=>r.data),
}
