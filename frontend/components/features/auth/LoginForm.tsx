'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export const LoginForm = () => {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setError(null);
            await login(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl space-y-6"
        >
            <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4F46E5]/20">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[#1e293b]">Welcome Back</h1>
                <p className="text-[#64748b]">Continue your journey with Majorly</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            {...register('email')}
                            className="pl-10 h-12 rounded-2xl bg-[#f1f5f9] border-0 focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-sm text-[#4F46E5] hover:underline">
                            Forgot?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('password')}
                            className="pl-10 pr-10 h-12 rounded-2xl bg-[#f1f5f9] border-0 focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1e293b]"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 transition-all shadow-lg shadow-[#4F46E5]/25 text-white"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </Button>
            </form>

            <div className="text-center text-sm text-[#64748b]">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#4F46E5] font-semibold hover:underline">
                    Create one
                </Link>
            </div>
        </motion.div>
    );
};
