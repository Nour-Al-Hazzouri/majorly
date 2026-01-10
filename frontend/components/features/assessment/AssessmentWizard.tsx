'use client';

import React, { useEffect, useState } from 'react';
import { useAssessmentStore } from '@/store/slices/assessmentStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, CheckCircle, ArrowRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import WelcomeStep from '@/components/features/assessment/WelcomeStep';
import { cn } from '@/lib/utils';
import RatingStep from '@/components/features/assessment/RatingStep';
import ResultsStep from '@/components/features/assessment/ResultsStep';
import SpecializationResultsStep from '@/components/features/assessment/SpecializationResultsStep';
import { toast } from 'sonner';
import { AssessmentResult, SpecializationResult } from '@/types';

interface AssessmentWizardProps {
    majorId?: number;
    backLink?: string;
    backLabel?: string;
}

const AssessmentWizard = ({ majorId, backLink = '/dashboard', backLabel = 'Back to Dashboard' }: AssessmentWizardProps) => {
    const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
    const {
        currentStep,
        sections,
        setSections,
        assessmentId,
        setAssessmentId,
        activeMajorId,
        setActiveMajorId,
        userId: storeUserId,
        setUserId: setStoreUserId,
        nextStep,
        prevStep,
        setStep,
        responses,
        results,
        setResults,
        isSubmitting,
        setIsSubmitting,
        reset: resetStore
    } = useAssessmentStore();

    const [isLoading, setIsLoading] = useState(true);

    // Initial check for major context mismatch to prevent "glitch" render
    // If we're on a page for Major A but store has Major B (or no major), we are in a mismatch.
    // We treat this as a loading state while we reset.
    const isContextMismatch = (majorId && activeMajorId !== majorId) || (!majorId && activeMajorId !== null);

    // Handle account-specific isolation and transitions
    useEffect(() => {
        if (authIsLoading) return;

        const currentUserId = user?.id || null;

        if (isAuthenticated && storeUserId === null) {
            // Guest -> User transition
            setStoreUserId(currentUserId);
        } else if (storeUserId !== null && storeUserId !== currentUserId) {
            // Account mismatch - switch or stale data from previous account
            resetStore();
            setStoreUserId(currentUserId);
        } else if (!isAuthenticated && storeUserId !== null) {
            // Guest session but store has old userId
            resetStore();
            setStoreUserId(null);
        }
    }, [user, isAuthenticated, authIsLoading, storeUserId, setStoreUserId, resetStore]);

    // Handle Major Context Switching (Deep Dive vs General vs Other Major)
    useEffect(() => {
        if (isContextMismatch) {
            // Context changed (e.g. User went from CS Deep Dive to Math Deep Dive)
            // We must reset the store to avoid "150% progress" bugs from previous state.
            resetStore();
            // If there is a majorId (Deep Dive), set it as active.
            // If not (Tier 1), activeMajorId stays null (from reset).
            if (majorId) {
                setActiveMajorId(majorId);
            }
        }
    }, [isContextMismatch, majorId, resetStore, setActiveMajorId]);

    // Handle results cleanup if they don't match current context
    useEffect(() => {
        if (results && results.length > 0) {
            const isTier1Result = 'major_id' in results[0];
            const isDeepDiveResult = 'occupation_id' in results[0] || 'specialization_id' in results[0];

            if (majorId && isTier1Result) {
                resetStore();
            } else if (!majorId && isDeepDiveResult) {
                resetStore();
            }
        }
    }, [majorId, results, resetStore]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const url = majorId
                    ? `/api/assessments/questions?major_id=${majorId}`
                    : '/api/assessments/questions';
                const response = await api.get(url);
                setSections(response.data);
            } catch (error) {
                toast.error('Failed to load assessment questions');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [setSections, majorId]);

    const handleStart = async () => {
        try {
            if (!assessmentId) {
                const payload = majorId
                    ? { type: 'deep_dive', metadata: { major_id: majorId } }
                    : { type: 'tier1' };
                const response = await api.post('/api/assessments', payload);
                setAssessmentId(response.data.id);
            }
            nextStep();
        } catch (error) {
            toast.error('Failed to start assessment');
        }
    };

    const handleSaveProgress = async () => {
        if (!assessmentId) return;

        try {
            await api.patch(`/api/assessments/${assessmentId}`, { responses });
            toast.success('Progress saved');
            nextStep();
        } catch (error) {
            toast.error('Failed to save progress');
        }
    };

    const handleSubmit = async () => {
        if (!assessmentId) return;

        setIsSubmitting(true);
        try {
            await api.patch(`/api/assessments/${assessmentId}`, { responses });
            const response = await api.post(`/api/assessments/${assessmentId}/submit`);

            // The backend returns results in different keys or structures 
            // for tier1 (results) and deep_dive (recommendations)
            const recommendations = response.data.recommendations || response.data.assessment?.results;
            setResults(recommendations);

            toast.success('Assessment submitted successfully!');
            nextStep();
        } catch (error) {
            toast.error('Failed to submit assessment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetake = () => {
        resetStore();
        setStep(0);
        window.scrollTo(0, 0);
    };

    if (isLoading || authIsLoading || isContextMismatch) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 rounded-full border-4 border-[#4F46E5] border-t-transparent"
                    />
                    <p className="text-[#64748b] font-medium">Preparing your assessment...</p>
                </div>
            </div>
        );
    }

    const progress = (currentStep / (sections.length + 1)) * 100;

    return (
        <div className="min-h-screen w-full font-sans">
            {/* Simple Nav */}
            <nav className="border-b border-white/30 backdrop-blur-md bg-white/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                            Majorly
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild className="text-[#64748b]">
                            <Link href={backLink}>{backLabel}</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <div className={cn(
                "mx-auto py-12 px-4 transition-all duration-500",
                results ? "max-w-4xl" : "max-w-3xl"
            )}>
                {!results && (
                    <div className="mb-10 text-center">
                        <div className="flex justify-between items-end mb-3 px-1">
                            <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                                Assessment Progress
                            </span>
                            <span className="text-xs font-bold text-[#64748b]">
                                {Math.round(progress)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-white/50 rounded-full h-2.5 shadow-sm overflow-hidden border border-white">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
                            />
                        </div>
                    </div>
                )}



                {/* AI & Professional Disclaimer */}
                <div className="mb-10 max-w-2xl mx-auto">
                    <Alert variant="destructive" className="bg-red-50 border-red-200 rounded-2xl shadow-sm border-2 animate-in fade-in slide-in-from-top-4 duration-700">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <AlertTitle className="text-red-900 font-bold mb-2 flex items-center gap-2">
                            AI Advisory & Methodology Notice
                        </AlertTitle>
                        <AlertDescription className="text-red-800/80 text-sm leading-relaxed">
                            This assessment is an AI-powered discovery tool designed to match your self-reported skills and tendencies to potential academic paths.
                            <span className="font-bold block mt-2 text-red-900">Important Considerations:</span>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>Results are generated by AI algorithms and have not been individually reviewed by human career experts.</li>
                                <li>Matching is based on relevance and similarity, not on absolute professional requirements or official admission criteria.</li>
                                <li>We encourage users to cross-reference these findings with the official sources (O*NET and SOC) linked on the <Link href="/about" className="font-bold underline hover:text-red-950 transition-colors inline-flex items-center gap-1">About Us <ExternalLink size={12} /></Link> page.</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </div>

                <AnimatePresence mode="wait">
                    {results ? (
                        results.length > 0 && ('specialization_id' in results[0] || 'occupation_id' in results[0]) ? (
                            <SpecializationResultsStep
                                key="specialization-results"
                                results={results as SpecializationResult[]}
                                onRetake={handleRetake}
                            />
                        ) : (
                            <ResultsStep
                                key="results"
                                results={results as AssessmentResult[]}
                                onRetake={handleRetake}
                            />
                        )
                    ) : (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {currentStep === 0 && <WelcomeStep onStart={handleStart} isDeepDive={!!majorId} />}

                            {currentStep > 0 && currentStep <= sections.length && (
                                <div className="space-y-6">
                                    <RatingStep
                                        section={sections[currentStep - 1]}
                                        onNext={currentStep === sections.length ? handleSubmit : handleSaveProgress}
                                        onBack={prevStep}
                                        isLastStep={currentStep === sections.length}
                                        isSubmitting={isSubmitting}
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AssessmentWizard;
