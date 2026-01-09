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
        <Card className="flex flex-col h-full group hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white border-slate-200/60 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pt-6 pb-4 px-6 space-y-4">
                <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-3 py-1 font-semibold tracking-wide text-xs uppercase">
                        {category}
                    </Badge>
                    <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                        <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight min-h-[3.5rem] flex items-center">
                    {name}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow px-6 pb-6">
                <p className="text-slate-500 text-base leading-relaxed line-clamp-3 group-hover:text-slate-600 transition-colors">
                    {description}
                </p>
            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6 mt-auto">
                <Button asChild className="w-full h-12 text-base font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md group/btn">
                    <Link href={`/majors/${slug}`}>
                        Explore Major
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
