'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Zap } from 'lucide-react';

interface Skill {
    id: number;
    name: string;
    category: string;
}

interface Occupation {
    id: number;
    name: string;
}

interface Specialization {
    id: number;
    name: string;
    description: string;
    skills: Skill[];
    occupations: Occupation[];
}

interface SpecializationsListProps {
    specializations: Specialization[];
}

export const SpecializationsList: React.FC<SpecializationsListProps> = ({ specializations }) => {
    if (!specializations || specializations.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                    <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Specializations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specializations.map((spec) => (
                    <Card key={spec.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-slate-800">{spec.name}</CardTitle>
                            <CardDescription className="line-clamp-2">{spec.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Specialized Skills */}
                            {spec.skills && spec.skills.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> Key Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {spec.skills.slice(0, 6).map(skill => (
                                            <Badge key={skill.id} variant="secondary" className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 border-indigo-100">
                                                {skill.name}
                                            </Badge>
                                        ))}
                                        {spec.skills.length > 6 && (
                                            <span className="text-xs text-slate-400 self-center px-1">+{spec.skills.length - 6} more</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Associated Roles */}
                            {spec.occupations && spec.occupations.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Typical Roles
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        {spec.occupations.map(o => o.name).join(', ')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
