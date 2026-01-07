'use client';

import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SavedMajorsProps {
    majors: any[];
    compact?: boolean;
}

export function SavedMajors({ majors, compact = false }: SavedMajorsProps) {
    if (!majors || majors.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500">No saved majors yet.</p>
                <Button asChild variant="link" className="mt-2 text-indigo-600">
                    <Link href="/majors">Browse all majors</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {majors.map((major) => (
                <div
                    key={major.id}
                    className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all"
                >
                    <div className="space-y-1">
                        <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-xs tracking-wider">
                            {major.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{major.category}</p>
                    </div>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-indigo-600">
                        <Link href={`/majors/${major.slug}`}>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            ))}
            {compact && majors.length >= 4 && (
                <Button asChild variant="link" className="w-full text-slate-500 text-xs mt-2">
                    <Link href="/dashboard/profile?tab=favorites">View all favorites</Link>
                </Button>
            )}
        </div>
    );
}
