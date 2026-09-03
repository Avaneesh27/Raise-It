import axios from 'axios';
import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2, iOS simulator/Web uses localhost
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const mobileApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  register: (data: any) =>
    api.post('/auth/register', data),

  getDashboard: () =>
    api.get('/reports/dashboard'),

  getMyReports: (statusType?: 'active' | 'resolved' | 'all') =>
    api.get('/reports/my', { params: { statusType } }),

  getReportDetails: (reportId: string) =>
    api.get(`/reports/${reportId}`),

  getNearbyReports: (lng: number, lat: number, radius = 1500) =>
    api.get('/reports/nearby', { params: { lng, lat, radius } }),

  classifyImage: (formData: FormData) =>
    api.post('/ai/classify-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  analyzeReport: (data: {
    category: string;
    confidence: number;
    longitude: number;
    latitude: number;
  }) => api.post('/ai/analyze-report', data),

  submitReport: (formData: FormData) =>
    api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  queryRAG: (question: string, reportId?: string) =>
    api.post('/rag/query', { question, reportId }),

  getNotifications: () =>
    api.get('/notifications')
};

export default api;
