import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

// Campaigns
export const campaignAPI = {
  getAll: () => api.get('/campaigns'),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  getByCreator: (creatorId) => api.get(`/campaigns/creator/${creatorId}`),
  approveCampaign: (id) => api.put(`/campaigns/${id}/approve`),
  getPendingCampaigns: () => api.get('/campaigns/pending'),
};

// Contributions
export const contributionAPI = {
  create: (data) => api.post('/contributions', data),
  getUserContributions: (userId) => api.get(`/contributions/user/${userId}`),
  getCampaignContributions: (campaignId) => api.get(`/contributions/campaign/${campaignId}`),
  verifyPayment: (data) => api.post('/contributions/verify', data),
};

// User Types & Categories & Currencies
export const metaAPI = {
  getUserTypes: () => api.get('/user-types'),
  getCategories: () => api.get('/categories'),
  getCurrencies: () => api.get('/currencies'),
};

// Users
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;
