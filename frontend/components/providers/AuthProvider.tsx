'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { getCsrfCookie } from '@/lib/api';
import { LoginInput, RegisterInput } from '@/lib/validations/auth';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/slices/assessmentStore';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuthStatus = async () => {
        try {
            const response = await api.get('/api/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
            // Clear marker cookie if unauthorized
            document.cookie = 'majorly_logged_in=; Max-Age=0; path=/;';
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (data: LoginInput) => {
        await getCsrfCookie();
        await api.post('/api/login', data);
        const response = await api.get('/api/user');
        setUser(response.data);
        useAssessmentStore.getState().setUserId(response.data.id);
        router.push('/dashboard');
    };

    const register = async (data: RegisterInput) => {
        await getCsrfCookie();
        await api.post('/api/register', data);
        const response = await api.get('/api/user');
        setUser(response.data);
        useAssessmentStore.getState().setUserId(response.data.id);
        router.push('/dashboard');
    };

    const logout = async () => {
        try {
            await api.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local state and marker cookie
            document.cookie = 'majorly_logged_in=; Max-Age=0; path=/;';
            setUser(null);
            useAssessmentStore.getState().reset();
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
