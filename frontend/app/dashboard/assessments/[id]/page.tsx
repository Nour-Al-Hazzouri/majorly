'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import ResultsStep from "@/components/features/assessment/ResultsStep";
import SpecializationResultsStep from "@/components/features/assessment/SpecializationResultsStep";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssessmentResultsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [assessment, setAssessment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                // Assuming the backend has an endpoint for a single assessment
                // or we can use the profile endpoint and filter if needed.
                // For now, let's try a direct endpoint if it exists or create one.
                const response = await api.get(`/api/assessments/${id}`);
                setAssessment(response.data.assessment);
            } catch (error) {
                console.error("Failed to fetch assessment:", error);
                toast.error("Failed to load assessment results");
                router.push('/dashboard/profile?tab=assessments');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchAssessment();
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <main className="md:ml-64 p-8">
                    <div className="max-w-4xl mx-auto space-y-8 text-center pt-20">
                        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                        <Skeleton className="h-10 w-64 mx-auto" />
                        <Skeleton className="h-4 w-96 mx-auto" />
                        <div className="space-y-4 pt-10">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!assessment) return null;

    const results = assessment.results;
    const isDeepDive = assessment.type === 'deep_dive';

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className="md:ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6">
                        <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-indigo-600 -ml-2">
                            <Link href="/dashboard/profile?tab=assessments">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Assessment History
                            </Link>
                        </Button>
                    </div>

                    {isDeepDive ? (
                        <SpecializationResultsStep
                            results={results}
                            onRetake={() => router.push(`/assessment/deep_dive/${assessment.metadata?.major_id}`)}
                        />
                    ) : (
                        <ResultsStep
                            results={results}
                            onRetake={() => router.push('/assessment')}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
