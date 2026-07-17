import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Network error, please try again.';
    return Promise.reject(new Error(message));
  },
);

// API functions

export interface ApplicationPayload {
  name: string;
  gender: string;
  phone: string;
  email: string;
  nationality: string;
  birthday: string;
  passport_number: string;
  proficient_languages: string[];
  hsk_level: string;
  english_proficiency: string;
  university: string;
  major: string;
  highest_degree: string;
  current_academic_year: string;
  graduation_date: string;
  post_graduation_plan: string;
  intended_city: string;
  family_business: string;
}

export function submitApplication(data: ApplicationPayload) {
  return api.post('/applications', data);
}

export function fetchDictOptions() {
  return api.get('/dict/options');
}

export default api;
