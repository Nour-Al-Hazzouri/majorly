import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

// This is required for Sanctum cookie-based auth
export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');

export default api;
