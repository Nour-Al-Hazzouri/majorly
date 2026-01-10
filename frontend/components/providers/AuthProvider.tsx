'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken, getAuthToken } from '@/lib/api';
import { LoginInput, RegisterInput } from '@/lib/validations/auth';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/slices/assessmentStore';

import Cookies from 'js-cookie';

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
        const token = getAuthToken();
        if (!token) {
            setUser(null);
            setIsLoading(false);
            Cookies.remove('is_authenticated');
            return;
        }

        try {
            const response = await api.get('/api/user');
            setUser(response.data);
            Cookies.set('is_authenticated', 'true', { expires: 7 });
        } catch (error) {
            // Token is invalid or expired
            setAuthToken(null);
            setUser(null);
            Cookies.remove('is_authenticated');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (data: LoginInput) => {
        const response = await api.post('/api/login', data);
        const { token, user: userData } = response.data;
        setAuthToken(token);
        setUser(userData);
        Cookies.set('is_authenticated', 'true', { expires: 7 });
        useAssessmentStore.getState().setUserId(userData.id);
        // Use replace to avoid back-button issues and force a full navigation
        window.location.href = '/dashboard';
    };

    const register = async (data: RegisterInput) => {
        const response = await api.post('/api/register', data);
        const { token, user: userData } = response.data;
        setAuthToken(token);
        setUser(userData);
        Cookies.set('is_authenticated', 'true', { expires: 7 });
        useAssessmentStore.getState().setUserId(userData.id);
        // Use replace to avoid back-button issues and force a full navigation
        window.location.href = '/dashboard';
    };

    const logout = async () => {
        try {
            await api.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuthToken(null);
            setUser(null);
            Cookies.remove('is_authenticated');
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

