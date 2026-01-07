import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Forgot Password | Majorly',
    description: 'Request a password reset link for your Majorly account.',
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
