import axios from 'axios';

const API_URL = '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (resetToken, password) => api.put(`/auth/resetpassword/${resetToken}`, { password }),
};

// Bootcamp APIs
export const bootcampAPI = {
  getAll: (params) => api.get('/bootcamps', { params }),
  getById: (id) => api.get(`/bootcamps/${id}`),
  create: (data) => api.post('/bootcamps', data),
  update: (id, data) => api.put(`/bootcamps/${id}`, data),
  delete: (id) => api.delete(`/bootcamps/${id}`),
  uploadPhoto: (id, formData) => api.put(`/bootcamps/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getInRadius: (zipcode, distance) => api.get(`/bootcamps/radius/${zipcode}/${distance}`),
};

// Course APIs
export const courseAPI = {
  // If bootcampId provided, scope to that bootcamp; otherwise fetch all courses
  getAll: (bootcampId) =>
    bootcampId ? api.get(`/bootcamps/${bootcampId}/courses`) : api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (bootcampId, data) => api.post(`/bootcamps/${bootcampId}/courses`, data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Review APIs
export const reviewAPI = {
  getAllForBootcamp: (bootcampId) => api.get(`/bootcamps/${bootcampId}/reviews`),
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (bootcampId, data) => api.post(`/bootcamps/${bootcampId}/reviews`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// User APIs
export const userAPI = {
  updateDetails: (data) => api.put('/auth/updatedetails', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
};

// Admin APIs
export const adminAPI = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
