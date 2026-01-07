'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface MajorCardProps {
    name: string;
    slug: string;
    category: string;
    description: string;
}

export const MajorCard: React.FC<MajorCardProps> = ({ name, slug, category, description }) => {
    return (
        <Card className="flex flex-col h-full group hover:border-[#4F46E5]/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#EEF2FF] font-medium">
                        {category}
                    </Badge>
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-[#EEF2FF] transition-colors">
                        <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#4F46E5]" />
                    </div>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors line-clamp-1">
                    {name}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {description}
                </p>
            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6">
                <Button asChild className="w-full rounded-xl bg-white border-[#e2e8f0] text-[#1e293b] hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all group/btn shadow-none">
                    <Link href={`/majors/${slug}`}>
                        Explore Major
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
