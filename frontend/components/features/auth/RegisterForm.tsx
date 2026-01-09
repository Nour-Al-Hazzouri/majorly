'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export const RegisterForm = () => {
    const { register: registerAction } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            setError(null);
            await registerAction(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
                <h1 className="text-3xl font-bold text-[#1e293b]">Create Account</h1>
                <p className="text-[#64748b]">Start your academic journey today</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            {...register('name')}
                            className="pl-10 h-12 rounded-2xl bg-[#f1f5f9] border-0 focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                        />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
                </div>

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
                    <Label htmlFor="password">Password</Label>
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

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <Input
                            id="password_confirmation"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('password_confirmation')}
                            className="pl-10 h-12 rounded-2xl bg-[#f1f5f9] border-0 focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-xs text-red-500 ml-1">{errors.password_confirmation.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 transition-all shadow-lg shadow-[#4F46E5]/25"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </Button>
            </form>

            <div className="text-center text-sm text-[#64748b]">
                Already have an account?{' '}
                <Link href="/login" className="text-[#4F46E5] font-semibold hover:underline">
                    Sign in
                </Link>
            </div>
        </motion.div>
    );
};
