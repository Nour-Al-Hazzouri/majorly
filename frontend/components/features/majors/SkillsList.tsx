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

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <Badge
                        key={skill.id}
                        variant="outline"
                        className="px-3 py-1 text-sm font-medium bg-white hover:bg-slate-50 transition-colors"
                    >
                        {skill.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
};
