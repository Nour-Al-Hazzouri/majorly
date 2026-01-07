import { LoginForm } from '@/components/features/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Majorly',
    description: 'Sign in to your Majorly account to continue your academic journey.',
};

export default function LoginPage() {
    return <LoginForm />;
}
