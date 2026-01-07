'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AssessmentHistoryProps {
    assessments: any[];
    compact?: boolean;
}

export function AssessmentHistory({ assessments, compact = false }: AssessmentHistoryProps) {
    if (!assessments || assessments.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500">No assessments found.</p>
                <Button asChild variant="link" className="mt-2 text-indigo-600">
                    <Link href="/assessment">Start your first assessment</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {assessments.map((assessment) => (
                <div
                    key={assessment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors bg-slate-50/50"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 capitalize">{assessment.type.replace('_', ' ')}</span>
                            <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'} className="text-[10px]">
                                {assessment.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                            {format(new Date(assessment.created_at), 'PPP')}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <div className="flex -space-x-2 overflow-hidden">
                            {assessment.results?.map((result: any) => (
                                <div
                                    key={result.id}
                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700"
                                    title={result.major.name}
                                >
                                    {Math.round(result.match_percentage)}%
                                </div>
                            ))}
                        </div>
                        {!compact && (
                            <Button asChild variant="ghost" size="sm" className="text-indigo-600">
                                <Link href={`/dashboard/assessments/${assessment.id}`}>
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            {compact && assessments.length >= 3 && (
                <Button asChild variant="link" className="w-full text-slate-500 text-xs">
                    <Link href="/dashboard/profile?tab=assessments">View all history</Link>
                </Button>
            )}
        </div>
    );
}
