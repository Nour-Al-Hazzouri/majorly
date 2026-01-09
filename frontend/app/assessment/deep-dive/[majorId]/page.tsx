import AssessmentWizard from '@/components/features/assessment/AssessmentWizard';
import { Metadata } from 'next';

interface DeepDiveAssessmentPageProps {
    params: Promise<{
        majorId: string;
    }>;
}

export const metadata: Metadata = {
    title: 'Deep Dive Assessment - Majorly',
    description: 'Get specialized career recommendations for your chosen major.',
};

export default async function DeepDiveAssessmentPage({ params }: DeepDiveAssessmentPageProps) {
    const { majorId } = await params;

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <AssessmentWizard
                majorId={parseInt(majorId)}
                backLink="/dashboard"
                backLabel="Back to Dashboard"
            />
        </main>
    );
}
