import { MajorDetailView } from '@/components/features/majors/MajorDetailView';
import { Metadata } from 'next';

interface MajorPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: MajorPageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Majorly`,
        description: `Explore details, required skills, and career paths for ${slug.replace('-', ' ')}.`,
    };
}

export default async function MajorPage({ params }: MajorPageProps) {
    const { slug } = await params;

    return (
        <main className="min-h-screen bg-white">
            <MajorDetailView slug={slug} />
        </main>
    );
}
