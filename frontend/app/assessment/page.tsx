import React from 'react';
import AssessmentWizard from '@/components/features/assessment/AssessmentWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Major Assessment | Majorly',
    description: 'Take the assessment to find your ideal major.',
};

export default function AssessmentPage() {
    return <AssessmentWizard />;
}
