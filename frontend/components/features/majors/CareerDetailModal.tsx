'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    DollarSign,
    TrendingUp,
    Briefcase,
    Target,
    Zap,
    Brain,
    CheckCircle2,
    Calendar,
    Globe,
    ExternalLink,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toggleFavorite, getFavoriteStatus } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

interface OnetKnowledge {
    id: number;
    name: string;
    description: string;
    type: string;
    pivot: {
        importance: number;
        level: number;
    };
}

interface OnetTechSkill {
    id: number;
    skill_name: string;
    hot_tech: boolean;
}

interface Occupation {
    id: number;
    name: string;
    code: string;
    description: string;
    median_salary: number;
    job_outlook: string;
    tasks: string[] | string | null;
    tech_skills?: OnetTechSkill[];
    onet_knowledge?: OnetKnowledge[];
}

interface CareerDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    career: Occupation | null;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({ isOpen, onClose, career }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (career && user && isOpen) {
                try {
                    const response = await getFavoriteStatus('occupation', career.id);
                    setIsFavorited(response.data.favorited);
                } catch (error) {
                    console.error("Failed to check favorite status", error);
                }
            }
        };

        checkFavoriteStatus();
    }, [career, user, isOpen]);

    const handleToggleFavorite = async () => {
        if (!career || favLoading) return;

        try {
            setFavLoading(true);
            const response = await toggleFavorite('occupation', career.id);
            setIsFavorited(response.data.favorited);
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        } finally {
            setFavLoading(false);
        }
    };

    if (!career) return null;

    const parsedTasks = typeof career.tasks === 'string'
        ? JSON.parse(career.tasks)
        : Array.isArray(career.tasks)
            ? career.tasks
            : [];

    const formatSalary = (salary: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(salary);
    };

    // Group knowledge by type and sort by importance with a stable tie-break
    const sortedKnowledge = (career.onet_knowledge || [])
        .sort((a, b) => {
            if (b.pivot.importance !== a.pivot.importance) {
                return b.pivot.importance - a.pivot.importance;
            }
            return b.pivot.level - a.pivot.level || a.name.localeCompare(b.name);
        });

    const knowledgeItems = sortedKnowledge.filter(k => k.type === 'Knowledge');
    const skillItems = sortedKnowledge.filter(k => k.type === 'Skill');

    const renderSkillBar = (item: OnetKnowledge, index: number, colorClass: string, progressBarClass: string, bgClass: string) => {
        const rawPercentage = item.pivot.importance * 20;
        // Apply a visual decrement for items after the first 2 in a tie-break group to avoid "flat" visuals
        // as requested by the user: "no more than 2 have the same percentage"
        let displayPercentage = rawPercentage;

        // Count how many preceding items in the sorted list have the same raw percentage
        const precedingTies = sortedKnowledge
            .filter(k => k.type === item.type)
            .slice(0, index)
            .filter(k => k.pivot.importance === item.pivot.importance).length;

        if (precedingTies >= 2) {
            // Apply 1% decrement for each tied item beyond the first 2
            displayPercentage = Math.max(0, rawPercentage - (precedingTies - 1));
        }

        return (
            <div key={`${item.id}-${item.name}-${index}`} className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    <span className={cn("text-xs font-bold", colorClass)}>{displayPercentage.toFixed(0)}%</span>
                </div>
                <div className={cn("h-2 w-full rounded-full overflow-hidden", bgClass)}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displayPercentage}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className={cn("h-full rounded-full", progressBarClass)}
                    />
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="career-detail-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-4 lg:p-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full h-full max-w-6xl bg-white rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-slate-200"
                    >
                        {/* Header Section */}
                        <div className="relative h-48 md:h-64 bg-slate-900 flex-shrink-0">
                            {/* Decorative background */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -ml-24 -mb-24" />
                            </div>

                            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3">
                                <Button
                                    size="icon"
                                    onClick={handleToggleFavorite}
                                    disabled={favLoading}
                                    className={cn(
                                        "rounded-full transition-all duration-300 backdrop-blur-md border border-white/10",
                                        isFavorited
                                            ? "bg-rose-500 hover:bg-rose-600 text-white"
                                            : "bg-white/10 hover:bg-white/20 text-white"
                                    )}
                                >
                                    <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                                </Button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-blue-600 text-white border-none px-3 py-1 font-bold tracking-wide uppercase text-[10px]">
                                        {career.code}
                                    </Badge>
                                    {career.job_outlook && (
                                        <Badge variant="outline" className="bg-white/10 text-blue-200 border-blue-400/30 font-medium">
                                            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                                            Outlook: {career.job_outlook}
                                        </Badge>
                                    )}
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
                                    {career.name}
                                </h2>
                            </div>
                        </div>

                        {/* Content Section */}
                        <ScrollArea className="flex-grow">
                            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Left Column: Main Info */}
                                <div className="lg:col-span-2 space-y-12">
                                    {/* Description */}
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Role Overview</h3>
                                        </div>
                                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                            {career.description}
                                        </p>
                                    </section>

                                    {/* Responsibilities */}
                                    {parsedTasks.length > 0 && (
                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                                                    <Target className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Key Responsibilities</h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                {parsedTasks.map((task: string, i: number) => (
                                                    <div
                                                        key={`${career.id}-task-${i}`}
                                                        className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors"
                                                    >
                                                        <div className="mt-1 flex-shrink-0">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                                {i + 1}
                                                            </div>
                                                        </div>
                                                        <p className="text-slate-600 leading-relaxed font-medium">
                                                            {task}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Knowledge & Skills */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                                                    <Brain className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Knowledge Areas</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {knowledgeItems.slice(0, 6).map((k, idx) => renderSkillBar(k, idx, 'text-amber-600', 'bg-amber-500', 'bg-amber-100'))}
                                            </div>
                                        </section>

                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                                                    <Zap className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Core Abilities</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {skillItems.slice(0, 6).map((k, idx) => renderSkillBar(k, idx, 'text-emerald-600', 'bg-emerald-500', 'bg-emerald-100'))}
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Right Column: Stats & Meta */}
                                <div className="space-y-8">
                                    {/* Quick Stats Card */}
                                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                                        <div className="space-y-6 relative z-10">
                                            <div>
                                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Median Salary</span>
                                                </div>
                                                <div className="text-4xl font-black tracking-tight">
                                                    {formatSalary(career.median_salary)}
                                                    <span className="text-lg font-normal text-slate-400 ml-1">/yr</span>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-white/10">
                                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Growth Factor</span>
                                                </div>
                                                <div className="text-xl font-bold text-blue-400">
                                                    {career.job_outlook}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tech Skills List */}
                                    {career.tech_skills && career.tech_skills.length > 0 && (
                                        <section className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Technology Proficiency</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {career.tech_skills.slice(0, 15).map((ts) => (
                                                    <Badge
                                                        key={ts.id}
                                                        variant="secondary"
                                                        className={cn(
                                                            "px-3 py-1.5 text-xs font-bold rounded-lg border-none shadow-sm",
                                                            ts.hot_tech
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-white text-slate-600"
                                                        )}
                                                    >
                                                        {ts.skill_name}
                                                        {ts.hot_tech && <Zap className="w-3 h-3 ml-1 fill-white" />}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </section>
                                    )}


                                </div>
                            </div>
                        </ScrollArea>

                        {/* Footer Section */}
                        <div className="p-6 md:p-8 border-t border-slate-100 bg-white flex-shrink-0 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-medium text-center md:text-left">Validated career data powered by O*NET 29.1</span>
                            </div>
                            <Button
                                size="lg"
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-8"
                                onClick={onClose}
                            >
                                Done Exploring
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
