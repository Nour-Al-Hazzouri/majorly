import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Reset Password | Majorly',
    description: 'Create a new password for your Majorly account.',
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
