import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register | Majorly',
    description: 'Create a Majorly account to start finding your ideal college major.',
};

export default function RegisterPage() {
    return <RegisterForm />;
}
