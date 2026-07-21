import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: unwrap data or extract error details
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const body = error.response?.data;
    const message = body?.message || 'Network error, please try again.';

    // Pass field-level errors if available (Zod validation response)
    const err = new Error(message) as Error & {
      status?: number;
      fieldErrors?: Array<{ field: string; message: string }>;
    };
    err.status = error.response?.status;
    if (body?.errors && Array.isArray(body.errors)) {
      err.fieldErrors = body.errors;
    }

    return Promise.reject(err);
  },
);

// ---- Types ----

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
  expected_position: string;
}

export interface DictOption {
  value: string;
  label: string;
}

export interface DictOptions {
  gender: DictOption[];
  highest_degree: DictOption[];
  hsk_level: DictOption[];
  english_proficiency: DictOption[];
  proficient_languages: DictOption[];
  current_academic_year: DictOption[];
  post_graduation_plan: DictOption[];
}

// ---- API Functions ----

export function submitApplication(data: ApplicationPayload) {
  return api.post('/applications', data) as Promise<{
    success: boolean;
    message: string;
    id: string;
  }>;
}

export function fetchDictOptions() {
  return api.get('/dict/options') as Promise<{
    success: boolean;
    data: DictOptions;
  }>;
}

export default api;
