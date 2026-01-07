'use client';

import React, { useEffect, useState } from 'react';
import { useAssessmentStore } from '@/store/slices/assessmentStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import WelcomeStep from '@/components/features/assessment/WelcomeStep';
import SkillsStep from '@/components/features/assessment/SkillsStep';
import { cn } from '@/lib/utils';
import RatingStep from '@/components/features/assessment/RatingStep';
import ResultsStep from '@/components/features/assessment/ResultsStep';
import { toast } from 'sonner';

const AssessmentWizard = () => {
    const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
    const {
        currentStep,
        sections,
        setSections,
        assessmentId,
        setAssessmentId,
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

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.get('/api/assessments/questions');
                setSections(response.data);
            } catch (error) {
                toast.error('Failed to load assessment questions');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [setSections]);

    const handleStart = async () => {
        try {
            if (!assessmentId) {
                const response = await api.post('/api/assessments', { type: 'tier1' });
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
            setResults(response.data.recommendations);
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

    if (isLoading || authIsLoading) {
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
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                            Majorly
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild className="text-[#64748b]">
                            <Link href="/">Exit</Link>
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

                <AnimatePresence mode="wait">
                    {results ? (
                        <ResultsStep
                            key="results"
                            results={results}
                            onRetake={handleRetake}
                        />
                    ) : (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {currentStep === 0 && <WelcomeStep onStart={handleStart} />}

                            {currentStep > 0 && currentStep <= sections.length && (
                                <div className="space-y-6">
                                    {sections[currentStep - 1].type === 'skills_search' ? (
                                        <SkillsStep
                                            section={sections[currentStep - 1]}
                                            onNext={handleSaveProgress}
                                            onBack={prevStep}
                                        />
                                    ) : (
                                        <RatingStep
                                            section={sections[currentStep - 1]}
                                            onNext={currentStep === sections.length ? handleSubmit : handleSaveProgress}
                                            onBack={prevStep}
                                            isLastStep={currentStep === sections.length}
                                            isSubmitting={isSubmitting}
                                        />
                                    )}
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
