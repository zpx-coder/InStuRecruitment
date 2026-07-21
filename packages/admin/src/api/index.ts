import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token (check both storages)
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } });
    }
    const message = error.response?.data?.message || '请求失败，请重试';
    return Promise.reject(new Error(message));
  },
);

// ---- Types ----

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ApplicationQuery {
  page?: number;
  per_page?: number;
  nationality?: string;
  highest_degree?: string;
  hsk_level?: string;
  intended_city?: string;
  name?: string;
  university?: string;
  proficient_languages?: string;
  english_proficiency?: string;
  post_graduation_plan?: string;
}

// ---- API Functions ----

export function login(data: LoginPayload) {
  return api.post('/auth/login', data);
}

export function fetchAuthMe() {
  return api.get('/auth/me');
}

export function fetchApplications(params: ApplicationQuery) {
  return api.get('/applications', { params });
}

export function fetchApplicationDetail(id: string) {
  return api.get(`/applications/${id}`);
}

export function exportExcel(params: ApplicationQuery) {
  return api.get('/applications/export', {
    params,
    responseType: 'blob',
  });
}

export function updateApplicationNotes(id: string, notes: string) {
  return api.patch(`/applications/${id}`, { notes });
}

export default api;
