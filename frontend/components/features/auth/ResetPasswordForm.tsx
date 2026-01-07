'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations/auth';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import Link from 'next/link';

export const ResetPasswordForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: token || '',
            email: email || '',
        }
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        try {
            setError(null);
            await api.post('/api/reset-password', data);
            toast.success('Password reset successfully! You can now sign in.');
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    if (!token || !email) {
        return (
            <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl text-center">
                <p className="text-red-500">Invalid or missing reset token. Please request a new link.</p>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/forgot-password">Request New Link</Link>
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl space-y-6"
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#1e293b]">New Password</h1>
                <p className="text-[#64748b]">Create a strong password for your account</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register('token')} />
                <input type="hidden" {...register('email')} />

                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
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
                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
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
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                </Button>
            </form>
        </motion.div>
    );
};

