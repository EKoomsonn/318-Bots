import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Blood Requests
  getRequests: async (params = {}) => {
    const res = await client.get('/requests', { params });
    return res.data;
  },
  getRequestById: async (id) => {
    const res = await client.get(`/requests/${id}`);
    return res.data;
  },
  createRequest: async (payload) => {
    const res = await client.post('/requests', payload);
    return res.data;
  },
  scheduleDonation: async (requestId, payload) => {
    const res = await client.post(`/requests/${requestId}/schedule`, payload);
    return res.data;
  },
  updateRequestStatus: async (requestId, status) => {
    const res = await client.patch(`/requests/${requestId}/status`, { status });
    return res.data;
  },

  // Donors
  getDonors: async (params = {}) => {
    const res = await client.get('/donors', { params });
    return res.data;
  },
  getDonorById: async (id) => {
    const res = await client.get(`/donors/${id}`);
    return res.data;
  },
  registerDonor: async (payload) => {
    const res = await client.post('/donors', payload);
    return res.data;
  },

  // Hospitals & Platform Meta
  getHospitals: async () => {
    const res = await client.get('/hospitals');
    return res.data;
  },
  getStats: async () => {
    const res = await client.get('/hospitals/meta/stats');
    return res.data;
  },
  getCompatibilityMatrix: async () => {
    const res = await client.get('/hospitals/meta/compatibility-matrix');
    return res.data;
  },
  checkHealth: async () => {
    const res = await client.get('/health');
    return res.data;
  }
};

export default api;
