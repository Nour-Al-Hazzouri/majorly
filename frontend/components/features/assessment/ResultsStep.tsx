'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    ArrowRight,
    RefreshCcw,
    Heart,
    ChevronDown,
    ChevronUp,
    Sparkles,
    BookOpen,
    Target,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Major, AssessmentResult } from '@/types';
import api from '@/lib/api';
import { useAssessmentStore } from '@/store/slices/assessmentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ResultsStepProps {
    results: AssessmentResult[];
    onRetake: () => void;
}

export default function ResultsStep({ results, onRetake }: ResultsStepProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 text-green-600 mb-2">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold text-[#1e293b] tracking-tight">
                    Your Major Matches are Ready!
                </h2>
                <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
                    Based on your skills, interests, and strengths, we've identified the following academic paths that best align with your profile.
                </p>
            </motion.div>

            <div className="space-y-6">
                {results.filter(r => r.major).map((result, index) => (
                    <MajorResultCard
                        key={result.major!.id}
                        result={result}
                        index={index}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-4 pt-8"
            >
                <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 text-center max-w-lg">
                    <p className="text-[#64748b] mb-4">
                        Not satisfied with these results? You can refine your answers or start over to get better recommendations.
                    </p>
                    <Button
                        onClick={onRetake}
                        variant="outline"
                        className="rounded-xl border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5]/5 gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Retake Assessment
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

function MajorResultCard({ result, index }: { result: AssessmentResult; index: number }) {
    if (!result.major) return null;
    const major = result.major;

    const [isExpanded, setIsExpanded] = useState(index === 0);
    const [isFavorite, setIsFavorite] = useState(major.is_favorite ?? false);
    const [isSaving, setIsSaving] = useState(false);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSaving(true);
        try {
            const response = await api.post(`/api/majors/${major.id}/favorite`);
            setIsFavorite(response.data.is_favorite);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className={cn(
                "overflow-hidden border-none shadow-xl transition-all duration-300",
                isExpanded ? "ring-2 ring-[#4F46E5]/20" : "hover:shadow-2xl"
            )}>
                <div
                    className="p-6 cursor-pointer bg-white/70 backdrop-blur-md"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg",
                                index === 0 ? "bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]" : "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]"
                            )}>
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1e293b]">{major.name}</h3>
                                <p className="text-[#64748b] font-medium">{major.category}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6 mt-4 md:mt-0 pl-16 md:pl-0">
                            <div className="text-left md:text-right">
                                <span className="text-2xl md:text-3xl font-black text-[#4F46E5]">
                                    {Math.round(result.match_percentage)}%
                                </span>
                                <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Match Score</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    disabled={isSaving}
                                    onClick={toggleFavorite}
                                    className={cn(
                                        "rounded-full transition-all duration-300",
                                        isFavorite ? "bg-red-50 text-red-500" : "hover:bg-gray-100 text-gray-400"
                                    )}
                                >
                                    <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                                </Button>
                                {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardContent className="pt-0 pb-6 px-6 bg-white/40 backdrop-blur-sm border-t border-white/40">
                                <div className="space-y-6 pt-6">
                                    <p className="text-[#475569] leading-relaxed">
                                        {major.description}
                                    </p>

                                    <div className="grid md:grid-rows-1 gap-4">
                                        <div className="bg-white/80 p-4 rounded-xl border border-white shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm uppercase tracking-wide">
                                                <Sparkles className="w-4 h-4" />
                                                Why this matches
                                            </div>
                                            <ul className="space-y-2">
                                                {result.reasoning.map((reason, rIdx) => (
                                                    <li key={rIdx} className="flex items-start gap-2 text-[#475569] text-sm font-medium">
                                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                                                        {reason}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <Button asChild className="w-full sm:w-auto rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/20 gap-2">
                                            <Link href={`/majors/${major.slug}`}>
                                                Explore Major Details
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="w-full sm:w-auto rounded-xl border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5]/5 gap-2">
                                            <Link href={`/assessment/deep-dive/${major.id}`}>
                                                Take Deep Dive
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" className="w-full sm:w-auto rounded-xl text-[#64748b] hover:bg-white/60 gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            View Career Paths
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
