'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MajorHeaderProps {
    name: string;
    category: string;
    description: string;
    children?: React.ReactNode;
}

export const MajorHeader: React.FC<MajorHeaderProps> = ({ name, category, description, children }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">
                        {category}
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 line-clamp-2">
                        {name}
                    </h1>
                </div>
                {children && <div className="flex-shrink-0">{children}</div>}
            </div>

            <Card className="border-none shadow-sm bg-slate-50/50">
                <CardContent className="pt-6">
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {description}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
