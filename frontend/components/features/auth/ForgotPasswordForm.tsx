'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export const ForgotPasswordForm = () => {
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            setError(null);
            await api.post('/forgot-password', data);
            setIsSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    if (isSent) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl text-center space-y-6"
            >
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[#1e293b]">Check your email</h2>
                    <p className="text-[#64748b]">
                        We've sent a password reset link to your email address.
                    </p>
                </div>
                <Button asChild className="w-full h-12 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA]">
                    <Link href="/login">Return to Sign In</Link>
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl space-y-6"
        >
            <div className="space-y-2">
                <Link href="/login" className="inline-flex items-center text-sm text-[#64748b] hover:text-[#4F46E5] mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
                </Link>
                <h1 className="text-3xl font-bold text-[#1e293b]">Reset Password</h1>
                <p className="text-[#64748b]">Enter your email and we'll send you a link to reset your password.</p>
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

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 transition-all shadow-lg shadow-[#4F46E5]/25"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                </Button>
            </form>
        </motion.div>
    );
};
