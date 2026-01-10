import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { CareerDetailModal } from './CareerDetailModal';

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

interface CareerPathsProps {
    occupations: Occupation[];
}

export const CareerPaths: React.FC<CareerPathsProps> = ({ occupations }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCareer, setSelectedCareer] = useState<Occupation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 9;

    if (!occupations || occupations.length === 0) return null;

    const totalPages = Math.ceil(occupations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOccupations = occupations.slice(startIndex, startIndex + itemsPerPage);

    const formatSalary = (salary: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(salary);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const element = document.getElementById('career-paths');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCareerClick = (occupation: Occupation) => {
        setSelectedCareer(occupation);
        setIsModalOpen(true);
    };

    return (
        <div id="career-paths" className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-slate-900">Career Paths</h2>
                <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                    {occupations.length} Careers
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentOccupations.map((occupation) => (
                    <Card
                        key={`${occupation.id}-${occupation.code || occupation.name}`}
                        className="group hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white border-slate-200 cursor-pointer relative overflow-hidden flex flex-col"
                        onClick={() => handleCareerClick(occupation)}
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>

                        <CardHeader className="pb-3 space-y-3">
                            <div className="flex justify-between items-start gap-4 pr-6">
                                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 min-h-[3rem]">
                                    {occupation.name}
                                </CardTitle>
                            </div>
                            <CardDescription className="line-clamp-3 text-sm leading-relaxed text-slate-500 font-medium">
                                {occupation.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                                <div className="text-[11px] font-bold text-blue-600/60 uppercase tracking-widest flex items-center justify-between">
                                    Full Analysis Available
                                    <ArrowUpRight className="w-3 h-3" />
                                </div>
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

            <CareerDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                career={selectedCareer}
            />
        </div>
    );
};
