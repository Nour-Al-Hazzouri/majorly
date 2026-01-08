import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

interface Occupation {
    id: number;
    name: string;
    code: string;
    description: string;
    median_salary: number;
    job_outlook: string;
}

interface CareerPathsProps {
    occupations: Occupation[];
}

export const CareerPaths: React.FC<CareerPathsProps> = ({ occupations }) => {
    const [currentPage, setCurrentPage] = useState(1);
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
        // Optional: scroll to top of section
        const element = document.getElementById('career-paths');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
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
                    <Card key={occupation.id} className="group hover:border-blue-500/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white border-slate-200">
                        <CardHeader className="pb-3 space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 min-h-[3rem]">
                                    {occupation.name}
                                </CardTitle>
                                {!occupation.code.startsWith('http') && (
                                    <Badge variant="outline" className="text-[10px] font-mono shrink-0 bg-slate-50 text-slate-500">
                                        {occupation.code}
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                                {occupation.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        Median Salary
                                    </span>
                                    <span className="font-semibold text-slate-900">{formatSalary(occupation.median_salary)}</span>
                                </div>
                                {occupation.job_outlook && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-1.5">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                            Outlook
                                        </span>
                                        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">
                                            {occupation.job_outlook}
                                        </span>
                                    </div>
                                )}
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
        </div>
    );
};
