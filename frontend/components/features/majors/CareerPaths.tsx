'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Briefcase } from 'lucide-react';

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
    if (!occupations || occupations.length === 0) return null;

    const formatSalary = (salary: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(salary);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">Career Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {occupations.map((occupation) => (
                    <Card key={occupation.id} className="group hover:border-blue-200 transition-all duration-300">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                                    {occupation.name}
                                </CardTitle>
                                <Badge variant="outline" className="text-xs font-mono">
                                    {occupation.code}
                                </Badge>
                            </div>
                            <CardDescription className="line-clamp-2 mt-2">
                                {occupation.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4 mt-2">
                                <div className="flex items-center text-slate-600 text-sm">
                                    <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                                    <span className="font-medium">{formatSalary(occupation.median_salary)}</span>
                                    <span className="text-slate-400 ml-1">/year</span>
                                </div>
                                <div className="flex items-center text-slate-600 text-sm">
                                    <TrendingUp className="w-4 h-4 mr-1 text-blue-500" />
                                    <span className="font-medium">{occupation.job_outlook}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
