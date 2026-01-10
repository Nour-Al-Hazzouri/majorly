import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Token management for cross-domain auth
export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('auth_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('auth_token');
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

// Initialize token from localStorage on app load
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

// Major Detail API
export const getMajors = (params?: { search?: string, category?: string, page?: number }) =>
    api.get('/api/majors', { params });
export const getMajorBySlug = (slug: string) => api.get(`/api/majors/${slug}`);
export const getMajorSkills = (majorId: number, params?: { page?: number, per_page?: number }) =>
    api.get(`/api/majors/${majorId}/skills`, { params });

export default api;

// Dashboard
export const getDashboardData = () => api.get('/api/dashboard');

// Favorites
export const toggleFavorite = (type: 'major' | 'specialization' | 'occupation', id: number) =>
    api.post('/api/favorites/toggle', { type, id });

export const getFavoriteStatus = (type: 'major' | 'specialization' | 'occupation', id: number) =>
    api.get('/api/favorites/status', { params: { type, id } });

