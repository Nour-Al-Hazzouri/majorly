'use client';

import React, { useEffect, useState } from 'react';
import { getMajorBySlug } from '@/lib/api';
import { MajorHeader } from './MajorHeader';
import { SkillsList } from './SkillsList';
import { CareerPaths } from './CareerPaths';
import { Loader2, AlertCircle, ChevronLeft, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface MajorDetailViewProps {
    slug: string;
}

export const MajorDetailView: React.FC<MajorDetailViewProps> = ({ slug }) => {
    const [major, setMajor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchMajor = async () => {
            try {
                setLoading(true);
                const response = await getMajorBySlug(slug);
                setMajor(response.data);
            } catch (err: any) {
                console.error('Error fetching major:', err);
                setError(err.response?.status === 404
                    ? 'Major not found.'
                    : 'An error occurred while fetching the major details.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchMajor();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Loading major details...</p>
            </div>
        );
    }

    if (error || !major) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error || 'Major details could not be loaded.'}
                    </AlertDescription>
                </Alert>
                <div className="mt-6 flex justify-center">
                    <Button asChild variant="outline">
                        <Link href="/majors">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Browse All Majors
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <Button asChild variant="ghost" className="-ml-2 text-slate-500 hover:text-slate-900">
                    <Link href="/majors">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Explore
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <section>
                    <MajorHeader
                        name={major.name}
                        category={major.category}
                        description={major.description}
                    />
                </section>

                <hr className="border-slate-100" />

                <section>
                    <SkillsList skills={major.skills} />
                </section>

                <hr className="border-slate-100" />

                <section>
                    <CareerPaths occupations={major.occupations} />
                </section>

                <section className="bg-blue-600 rounded-2xl p-8 text-white mt-8 overflow-hidden relative shadow-xl shadow-blue-200">
                    <div className="relative z-10 max-w-2xl">
                        <h3 className="text-3xl font-bold mb-4">Ready for a Deep Dive?</h3>
                        <p className="text-blue-50 opacity-90 mb-6 text-lg">
                            Take a specialized assessment to find the perfect specialization and see how well your unique skills match this major.
                        </p>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="font-semibold text-blue-700 hover:bg-white transition-all"
                            onClick={() => router.push(`/assessment/deep-dive/${major.id}`)}
                        >
                            Start Deep Dive Test
                        </Button>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 mb-4 mr-4 hidden md:block opacity-20 transform rotate-12">
                        <Briefcase size={120} />
                    </div>
                </section>
            </div>
        </div>
    );
};
