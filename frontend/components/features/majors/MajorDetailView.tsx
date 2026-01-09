'use client';

import React, { useEffect, useState } from 'react';
import { getMajorBySlug, toggleFavorite, getFavoriteStatus } from '@/lib/api';
import { MajorHeader } from './MajorHeader';
import { SkillsList } from './SkillsList';
import { SpecializationsList } from './SpecializationsList';
import { CareerPaths } from './CareerPaths';
import { Loader2, AlertCircle, ChevronLeft, Briefcase, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

interface MajorDetailViewProps {
    slug: string;
}

export const MajorDetailView: React.FC<MajorDetailViewProps> = ({ slug }) => {
    const [major, setMajor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const fetchMajor = async () => {
            try {
                setLoading(true);
                const response = await getMajorBySlug(slug);
                setMajor(response.data);

                // Check favorite status if major is loaded and user is logged in
                if (response.data && user) {
                    try {
                        const favStatus = await getFavoriteStatus('major', response.data.id);
                        setIsFavorited(favStatus.data.favorited);
                    } catch (e) {
                        console.error("Failed to check favorite status", e);
                    }
                }
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
    }, [slug, user]);

    const handleToggleFavorite = async () => {
        if (!major || favLoading) return;

        try {
            setFavLoading(true);
            const response = await toggleFavorite('major', major.id);
            setIsFavorited(response.data.favorited);
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        } finally {
            setFavLoading(false);
        }
    };

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
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleToggleFavorite}
                            disabled={favLoading}
                            className={cn(
                                "flex items-center gap-2 transition-all duration-300",
                                isFavorited
                                    ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300"
                                    : "text-slate-600 hover:text-rose-600 hover:border-rose-200"
                            )}
                        >
                            <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                            {isFavorited ? "Saved" : "Save Major"}
                        </Button>
                    </MajorHeader>
                </section>

                <hr className="border-slate-100" />

                <section>
                    <SkillsList initialSkills={major.skills} majorId={major.id} />
                </section>

                <hr className="border-slate-100" />

                <section>
                    <SpecializationsList specializations={major.specializations} />
                </section>

                <hr className="border-slate-100" />

                <section>
                    <CareerPaths occupations={major.occupations} />
                </section>

                <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white mt-12 overflow-hidden relative shadow-2xl shadow-blue-200/50 border border-white/10">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-blue-50 text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles className="w-3.5 h-3.5" />
                            Premium Feature
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                            Ready for a Deep Dive?
                        </h3>
                        <p className="text-blue-50/90 mb-8 text-lg leading-relaxed">
                            Find your perfect specialization within {major.name}. Our data-driven deep dive test matches your unique interests to specialized career paths.
                        </p>
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 h-14 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group"
                            onClick={() => router.push(`/assessment/deep-dive/${major.id}`)}
                        >
                            Start Deep Dive Assessment
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block opacity-10 transform hover:scale-110 transition-transform duration-700">
                        <Briefcase size={240} className="rotate-12" />
                    </div>
                </section>
            </div>
        </div>
    );
};
