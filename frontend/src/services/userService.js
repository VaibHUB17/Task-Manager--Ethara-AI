import api from './api'

export default {
  search: (q) => api.get('/users', { params: { q } }).then(r => r.data),
}
