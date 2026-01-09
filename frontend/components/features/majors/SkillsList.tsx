import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMajorSkills } from '@/lib/api';
import { Loader2, ChevronLeft, ChevronRight, Brain } from 'lucide-react';

interface Skill {
    id: number;
    name: string;
    category: string;
}

interface SkillsListProps {
    initialSkills: Skill[];
    majorId: number;
}

export const SkillsList: React.FC<SkillsListProps> = ({ initialSkills, majorId }) => {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSkills, setTotalSkills] = useState(0);

    // Initial estimation of total pages based on the fact that initialSkills is capped at 10
    // We fetch the first page properly on mount to get actual total metadata
    useEffect(() => {
        const fetchInitialMeta = async () => {
            try {
                const response = await getMajorSkills(majorId, { page: 1 });
                setTotalPages(response.data.last_page);
                setTotalSkills(response.data.total);
                // Sync skills in case initialSkills (from prop) was different from fresh fetch
                setSkills(response.data.data);
            } catch (error) {
                console.error('Failed to fetch skill metadata:', error);
            }
        };
        fetchInitialMeta();
    }, [majorId]);

    const handlePageChange = async (newPage: number) => {
        if (newPage === currentPage || newPage < 1 || newPage > totalPages || loading) return;

        setLoading(true);
        try {
            const response = await getMajorSkills(majorId, { page: newPage });
            setSkills(response.data.data);
            setCurrentPage(newPage);

            // Scroll to top of skills section for better UX
            const element = document.getElementById('skills-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!skills || skills.length === 0) return null;

    const technicalSkills = skills.filter(s => s.category !== 'Soft Skill');
    const softSkills = skills.filter(s => s.category === 'Soft Skill');

    return (
        <div id="skills-section" className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                        <Brain className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Core Skills & Expertise</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full">
                        {totalSkills || skills.length} Total Skills
                    </span>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                </div>
            </div>

            <div className={loading ? "opacity-50 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Technical Skills */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Technical & Specialised</h3>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {technicalSkills.length > 0 ? technicalSkills.map((skill) => (
                                <Badge
                                    key={`${skill.id}-${skill.name}`}
                                    variant="secondary"
                                    className="px-4 py-1.5 text-sm font-semibold bg-white text-blue-700 hover:bg-blue-50 border-blue-100 shadow-sm transition-all duration-200"
                                >
                                    {skill.name}
                                </Badge>
                            )) : (
                                <p className="text-sm text-slate-400 italic">No technical skills listed for this page.</p>
                            )}
                        </div>
                    </div>

                    {/* Soft Skills */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Soft Skills & Abilities</h3>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {softSkills.length > 0 ? softSkills.map((skill) => (
                                <Badge
                                    key={`${skill.id}-${skill.name}`}
                                    variant="outline"
                                    className="px-4 py-1.5 text-sm font-semibold bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-100 shadow-sm transition-all duration-200"
                                >
                                    {skill.name}
                                </Badge>
                            )) : (
                                <p className="text-sm text-slate-400 italic">No soft skills listed for this page.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination UI - Consistent with Specializations/Careers */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-10 border-t border-slate-50">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all h-10 w-10"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                        <span className="text-sm font-black text-slate-900">Page {currentPage}</span>
                        <span className="text-sm font-bold text-slate-400">of {totalPages}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all h-10 w-10"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>
    );
};
