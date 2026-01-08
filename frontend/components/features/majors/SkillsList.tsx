'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Skill {
    id: number;
    name: string;
    category: string;
}

interface SkillsListProps {
    skills: Skill[];
}

export const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
    if (!skills || skills.length === 0) return null;

    const technicalSkills = skills.filter(s => s.category !== 'Soft Skill');
    const softSkills = skills.filter(s => s.category === 'Soft Skill');

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">Possible Skills (Based on chosen specialization)</h2>

            {/* Technical Skills */}
            {technicalSkills.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Technical & Core Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {technicalSkills.map((skill) => (
                            <Badge
                                key={skill.id}
                                variant="secondary"
                                className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                            >
                                {skill.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Soft Skills */}
            {softSkills.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Soft Skills & Abilities</h3>
                    <div className="flex flex-wrap gap-2">
                        {softSkills.map((skill) => (
                            <Badge
                                key={skill.id}
                                variant="outline"
                                className="px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                            >
                                {skill.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
