import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () => api.get('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.put(`/auth/reset-password/${token}`, { password }),
};

export const taskAPI = {
  getMyTasks: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return api.get(`/tasks/my?${params}`);
  },
  getUsers: () => api.get('/tasks/users'),
  getTask: (id: number) => api.get(`/tasks/${id}`),
  createTask: (task: any) => api.post('/tasks', task),
  updateTask: (id: number, updates: any) => api.put(`/tasks/${id}`, updates),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

export const commentAPI = {
  getTaskComments: (taskId: number) => api.get(`/comments/task/${taskId}`),
  createComment: (comment: any) => api.post('/comments', comment),
  updateComment: (id: number, data: { content: string }) => api.put(`/comments/${id}`, data),
  deleteComment: (id: number) => api.delete(`/comments/${id}`),
};

export const activityAPI = {
  getActivities: () => api.get('/activities'),
};

export const adminAPI = {
  getAllTasks: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return api.get(`/admin/tasks?${params}`);
  },
  getAllUsers: () => api.get('/admin/users'),
  getAllComments: () => api.get('/admin/comments'),
  updateUserRole: (userId: number, role: string) => api.put(`/admin/users/${userId}/role`, { role }),
  getStats: () => api.get('/admin/stats'),
};

export default api;