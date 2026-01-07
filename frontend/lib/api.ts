import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    withCredentials: true,
    withXSRFToken: true, // This ensures Axios automatically picks up the XSRF token
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

// This is required for Sanctum cookie-based auth
export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');

// Major Detail API
export const getMajors = (params?: { search?: string, category?: string, page?: number }) =>
    api.get('/api/majors', { params });
export const getMajorBySlug = (slug: string) => api.get(`/api/majors/${slug}`);

export default api;
