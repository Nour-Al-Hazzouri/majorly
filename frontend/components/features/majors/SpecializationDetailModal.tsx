'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Briefcase,
    Target,
    Zap,
    ArrowRight,
    CheckCircle2,
    Layers,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CareerDetailModal } from './CareerDetailModal';
import { toggleFavorite, getFavoriteStatus } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';

interface Skill {
    id: number;
    name: string;
    category: string;
}

interface Occupation {
    id: number;
    name: string;
    code: string;
    description: string;
    median_salary: number;
    job_outlook: string;
    tasks: string[] | string | null;
    tech_skills?: any[];
    onet_knowledge?: any[];
    skills?: Skill[];
}

interface Specialization {
    id: number;
    name: string;
    description: string;
    skills: Skill[];
    occupations: Occupation[];
}

interface SpecializationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    specialization: Specialization | null;
}

export const SpecializationDetailModal: React.FC<SpecializationDetailModalProps> = ({ isOpen, onClose, specialization }) => {
    const [selectedCareer, setSelectedCareer] = useState<Occupation | null>(null);
    const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (specialization && user && isOpen) {
                try {
                    const response = await getFavoriteStatus('specialization', specialization.id);
                    setIsFavorited(response.data.favorited);
                } catch (error) {
                    console.error("Failed to check favorite status", error);
                }
            }
        };

        checkFavoriteStatus();
    }, [specialization, user, isOpen]);

    const handleToggleFavorite = async () => {
        if (!specialization || favLoading) return;

        try {
            setFavLoading(true);
            const response = await toggleFavorite('specialization', specialization.id);
            setIsFavorited(response.data.favorited);
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        } finally {
            setFavLoading(false);
        }
    };

    if (!specialization) return null;


    const handleCareerClick = (occupation: Occupation) => {
        setSelectedCareer(occupation);
        setIsCareerModalOpen(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="specialization-detail-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-4 lg:p-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="w-full h-full max-w-6xl bg-white rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-slate-200"
                    >
                        {/* Header Section */}
                        <div className="relative h-48 md:h-64 bg-indigo-900 flex-shrink-0">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
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
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Specialization Deep Dive</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
                                    {specialization.name}
                                </h2>
                            </div>
                        </div>

                        {/* Content Section */}
                        <ScrollArea className="flex-grow">
                            <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-12">
                                {/* Description */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Field Focus</h3>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        {specialization.description}
                                    </p>
                                </section>

                                {/* Typical Career Paths */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Possible Career Paths</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {specialization.occupations.map((occ) => (
                                            <div
                                                key={`${occ.id}-${occ.code || occ.name}`}
                                                onClick={() => handleCareerClick(occ)}
                                                className="group p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                                            >
                                                <div>
                                                    <p className="text-sm text-slate-500 line-clamp-2">{occ.description}</p>
                                                </div>
                                                <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-100">
                                                    <ArrowRight className="w-4 h-4 text-blue-500 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Skills Section */}
                                {specialization.skills.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                                                <Zap className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Essential Skills for {specialization.name}</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {specialization.skills.map(skill => (
                                                <Badge
                                                    key={`${skill.id}-${skill.name}`}
                                                    variant="secondary"
                                                    className="px-4 py-2 text-sm font-bold bg-white text-slate-700 border border-slate-100 shadow-sm"
                                                >
                                                    {skill.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Footer */}
                        <div className="p-8 border-t border-slate-100 bg-white flex flex-shrink-0 items-center justify-end">
                            <Button
                                size="lg"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl px-12"
                                onClick={onClose}
                            >
                                Close Details
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <CareerDetailModal
                isOpen={isCareerModalOpen}
                onClose={() => setIsCareerModalOpen(false)}
                career={selectedCareer}
            />
        </AnimatePresence>
    );
};
