import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { getMajorSkills } from '@/lib/api';
import { Loader2, Brain, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
    const [allSkills, setAllSkills] = useState<Skill[]>(initialSkills);
    const [loadingAll, setLoadingAll] = useState(false);
    const [totalSkills, setTotalSkills] = useState(0);

    // Fetch ALL skills (or a large batch) to populate the modals
    useEffect(() => {
        const fetchAllSkills = async () => {
            try {
                setLoadingAll(true);
                // Fetch up to 500 skills to ensure the inline scroll areas are fully populated
                const response = await getMajorSkills(majorId, { per_page: 500 });
                setAllSkills(response.data.data);
                setTotalSkills(response.data.total);
            } catch (error) {
                console.error('Failed to fetch full skills list:', error);
            } finally {
                setLoadingAll(false);
            }
        };
        fetchAllSkills();
    }, [majorId]);

    return (
        <div id="skills-section" className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Professional Skills & Expertise</h2>
                        <p className="text-sm text-slate-500 font-medium">Verified professional competencies and domain knowledge</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-4 py-2 rounded-full border border-slate-200/50">
                        {totalSkills || allSkills.length} Verified Skills
                    </span>
                    {loadingAll && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                </div>
            </div>

            {/* Unified Skills Grid */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">Core Competencies</h3>
                    </div>
                </div>

                <ScrollArea className="h-[500px] w-full" type="always">
                    <div className="p-8 flex flex-wrap gap-2.5 content-start">
                        {allSkills.length > 0 ? (
                            allSkills.map((skill) => (
                                <Badge
                                    key={`${skill.id}-${skill.name}`}
                                    variant="secondary"
                                    className="px-4 py-2 text-[13px] font-bold bg-white text-blue-700 hover:bg-blue-50 border border-blue-100/50 shadow-sm transition-all duration-200 rounded-xl"
                                >
                                    {skill.name}
                                </Badge>
                            ))
                        ) : !loadingAll && (
                            <div className="w-full flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                <Zap className="w-8 h-8 opacity-20" />
                                <p className="text-sm italic font-medium">No professional skills found.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Information */}
            <div className="flex items-center justify-center pt-4">
                <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                    Scroll the list above to explore the full skill set
                </div>
            </div>
        </div>
    );
};
