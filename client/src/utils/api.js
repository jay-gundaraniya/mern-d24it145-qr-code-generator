import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const register = (email, password) =>
  api.post('/auth/signup', { email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// QR Code API calls
export const generateQRCode = (text) =>
  api.post('/qrcodes', { text });

export const getQRCodes = (page = 1, limit = 10, startDate, endDate) => {
  let url = `/qrcodes?page=${page}&limit=${limit}`;
  if (startDate && endDate) {
    url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
  }
  return api.get(url);
};

export const deleteQRCode = (id) =>
  api.delete(`/qrcodes/${id}`);

export const shareQRCode = (qrCodeId, recipientEmail) =>
  api.post('/qrcodes/share', { qrCodeId, recipientEmail });

export default api; 