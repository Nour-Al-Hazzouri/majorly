import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Zap, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpecializationDetailModal } from './SpecializationDetailModal';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSpec, setSelectedSpec] = useState<Specialization | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 6;

    if (!specializations || specializations.length === 0) return null;

    const totalPages = Math.ceil(specializations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSpecs = specializations.slice(startIndex, startIndex + itemsPerPage);

    const handleSpecClick = (spec: Specialization) => {
        setSelectedSpec(spec);
        setIsModalOpen(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const element = document.getElementById('specializations-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div id="specializations-section" className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                        <Layers className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">Specializations</h2>
                </div>
                <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                    {specializations.length} Fields
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSpecs.map((spec) => (
                    <Card
                        key={`${spec.id}-${spec.name}`}
                        className="border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                        onClick={() => handleSpecClick(spec)}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>

                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {spec.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 font-medium">
                                {spec.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Specialized Skills */}
                            {spec.skills && spec.skills.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-amber-500" /> Key Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {spec.skills.slice(0, 4).map(skill => (
                                            <Badge key={`${skill.id}-${skill.name}`} variant="secondary" className="px-2 py-0.5 text-[10px] bg-slate-50 text-slate-600 border-slate-100">
                                                {skill.name}
                                            </Badge>
                                        ))}
                                        {spec.skills.length > 4 && (
                                            <span className="text-[10px] font-bold text-slate-400 self-center px-1">+{spec.skills.length - 4} more</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Associated Roles */}
                            {spec.occupations && spec.occupations.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Typical Roles
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-1">
                                        {spec.occupations.map(o => o.name).join(', ')}
                                    </p>
                                </div>
                            )}

                            <div className="pt-2 flex items-center justify-end">
                                <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    View Details <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">Page {currentPage}</span>
                        <span className="text-sm text-slate-400">of {totalPages}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            )}

            <SpecializationDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                specialization={selectedSpec}
            />
        </div>
    );
};
