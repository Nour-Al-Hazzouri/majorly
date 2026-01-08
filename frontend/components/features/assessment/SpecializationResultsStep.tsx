'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    ArrowRight,
    RefreshCcw,
    Sparkles,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Briefcase,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpecializationResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface SpecializationResultsStepProps {
    results: SpecializationResult[];
    onRetake: () => void;
}

export default function SpecializationResultsStep({ results, onRetake }: SpecializationResultsStepProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-100 text-indigo-600 mb-2">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold text-[#1e293b] tracking-tight">
                    Your Specialization Matches
                </h2>
                <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
                    We've analyzed your deep dive responses. Here are the specializations that best fit your profile within this major.
                </p>
            </motion.div>

            <div className="space-y-6">
                {results.map((result, index) => (
                    <SpecializationCard
                        key={result.specialization?.id || result.occupation?.id}
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
                        Want to explore different answers? You can retake the deep dive to see other possibilities.
                    </p>
                    <Button
                        onClick={onRetake}
                        variant="outline"
                        className="rounded-xl border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5]/5 gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Retake Deep Dive
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

function SpecializationCard({ result, index }: { result: SpecializationResult; index: number }) {
    const [isExpanded, setIsExpanded] = useState(index === 0);

    // Determine if it's a Specialization or Occupation
    const item = result.specialization || result.occupation;
    const isOccupation = !!result.occupation;

    if (!item) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className={cn(
                "overflow-hidden border-none shadow-xl transition-all duration-300",
                isExpanded ? "ring-2 ring-indigo-500/20" : "hover:shadow-2xl"
            )}>
                <div
                    className="p-6 cursor-pointer bg-white/70 backdrop-blur-md"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg",
                                index === 0 ? "bg-gradient-to-br from-indigo-600 to-violet-600" : "bg-gradient-to-br from-slate-600 to-slate-800"
                            )}>
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1e293b]">{item.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                        isOccupation ? "text-emerald-600 bg-emerald-50" : "text-indigo-600 bg-indigo-50"
                                    )}>
                                        {isOccupation ? 'Career Path' : 'Specialization'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className={cn(
                                    "text-3xl font-black",
                                    isOccupation ? "text-emerald-600" : "text-indigo-600"
                                )}>
                                    {Math.round(result.match_percentage)}%
                                </span>
                                <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Match Score</p>
                            </div>

                            <div className="flex items-center gap-2">
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
                                        {item.description}
                                    </p>

                                    {/* Additional Occupation Info */}
                                    {isOccupation && (result.occupation) && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/60 p-4 rounded-xl">
                                                <div className="text-xs text-[#64748b] font-bold uppercase mb-1">Median Salary</div>
                                                <div className="text-lg font-bold text-slate-800">
                                                    ${parseInt(result.occupation.median_salary || '0').toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="bg-white/60 p-4 rounded-xl">
                                                <div className="text-xs text-[#64748b] font-bold uppercase mb-1">Job Outlook</div>
                                                <div className="text-lg font-bold text-emerald-600">
                                                    {result.occupation.job_outlook || 'Growth Stable'}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Legacy Specialization Logic */}
                                    {!isOccupation && result.specialization?.occupations && result.specialization.occupations.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wide">
                                                <Briefcase className="w-4 h-4" />
                                                Related Career Paths
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {result.specialization.occupations.map((occ: any) => (
                                                    <div key={occ.id} className="bg-white/80 p-4 rounded-xl border border-white shadow-sm hover:shadow-md transition-all">
                                                        <h4 className="font-bold text-[#1e293b] text-sm mb-2">{occ.name}</h4>
                                                        <div className="flex flex-wrap gap-3 text-xs text-[#64748b]">
                                                            <div className="flex items-center gap-1">
                                                                <DollarSign className="w-3 h-3" />
                                                                {occ.median_salary ? `$${parseInt(occ.median_salary).toLocaleString()}` : 'N/A'}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <TrendingUp className="w-3 h-3 text-green-500" />
                                                                {occ.job_outlook || 'Growing'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
