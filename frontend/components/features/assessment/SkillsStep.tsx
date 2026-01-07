'use client';

import React, { useState, useEffect } from 'react';
import { useAssessmentStore } from '@/store/slices/assessmentStore';
import { AssessmentSection, Skill } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Search, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface SkillsStepProps {
    section: AssessmentSection;
    onNext: () => void;
    onBack: () => void;
}

const SkillsStep = ({ section, onNext, onBack }: SkillsStepProps) => {
    const { responses, setResponse } = useAssessmentStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Skill[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const selectedSkills: Skill[] = responses[section.id] || [];

    useEffect(() => {
        const searchSkills = async () => {
            if (searchTerm.length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await api.get(`/api/skills?search=${searchTerm}`);
                const filtered = response.data.data.filter(
                    (skill: Skill) => !selectedSkills.some(s => s.id === skill.id)
                );
                setSearchResults(filtered);
            } catch (error) {
                console.error('Skill search failed', error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(searchSkills, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedSkills]);

    const handleSelect = (skill: Skill) => {
        const updated = [...selectedSkills, skill];
        setResponse(section.id, updated);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleRemove = (skillId: number) => {
        const updated = selectedSkills.filter(s => s.id !== skillId);
        setResponse(section.id, updated);
    };

    const canProceed = !section.required || (selectedSkills.length >= (section.min_selections || 0));

    return (
        <Card className="border-white bg-white/70 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="px-10 pt-10">
                <CardTitle className="text-3xl font-extrabold text-[#1e293b]">{section.title}</CardTitle>
                <CardDescription className="text-lg text-[#64748b] mt-2">{section.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 px-10 py-6">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Search className="h-5 w-5 text-[#94a3b8]" />
                    </div>
                    <Input
                        placeholder="Search for skills (e.g. Python, Design, Management)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-16 rounded-2xl border-white/50 bg-white/50 text-lg shadow-sm focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                    />
                    {isSearching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5]" />
                        </div>
                    )}

                    <AnimatePresence>
                        {searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                            >
                                {searchResults.map((skill) => (
                                    <button
                                        key={skill.id}
                                        className="w-full text-left px-6 py-4 hover:bg-[#F5F3FF] transition-colors text-base font-semibold text-[#1e293b] flex items-center justify-between group"
                                        onClick={() => handleSelect(skill)}
                                    >
                                        {skill.name}
                                        <ArrowRight className="h-4 w-4 text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-4">
                    <p className="text-sm font-bold text-[#4F46E5] uppercase tracking-wider px-1">
                        Selected Skills ({selectedSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {selectedSkills.length === 0 && (
                            <div className="w-full py-10 text-center border-2 border-dashed border-[#EEF2FF] rounded-2xl">
                                <p className="text-[#94a3b8] italic">No skills selected yet. Start searching above!</p>
                            </div>
                        )}
                        <AnimatePresence>
                            {selectedSkills.map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center gap-2 bg-[#F5F3FF] text-[#4F46E5] pl-4 pr-2 py-2 rounded-xl text-base font-bold border border-[#4F46E5]/10 shadow-sm"
                                >
                                    {skill.name}
                                    <button
                                        onClick={() => handleRemove(skill.id)}
                                        className="hover:bg-[#4F46E5] hover:text-white rounded-lg p-1 transition-all"
                                        aria-label={`Remove ${skill.name}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between px-10 pb-10 pt-6 border-t border-white/30 backdrop-blur-sm">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="rounded-full px-8 h-12 border-2 text-[#64748b] hover:bg-white"
                >
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!canProceed}
                    className="rounded-full px-10 h-12 font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] shadow-lg shadow-[#4F46E5]/20"
                >
                    {canProceed ? 'Continue' : `Select ${section.min_selections} more`}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SkillsStep;
