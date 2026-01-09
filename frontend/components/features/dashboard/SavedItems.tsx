'use client';

import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Layers, Briefcase } from "lucide-react";
import Link from "next/link";

interface SavedItemsProps {
    items: any[];
    type: 'major' | 'specialization' | 'occupation';
    compact?: boolean;
    onItemClick?: (item: any) => void;
}

export function SavedItems({ items, type, compact = false, onItemClick }: SavedItemsProps) {
    const config = {
        major: {
            icon: BookOpen,
            label: "majors",
            browseUrl: "/majors",
            getSlug: (item: any) => `/majors/${item.slug}`,
            getSubtext: (item: any) => item.category,
        },
        specialization: {
            icon: Layers,
            label: "specializations",
            browseUrl: "/majors",
            getSlug: (item: any) => `/majors/${item.major?.slug || ''}`, // Specializations are viewed within majors
            getSubtext: (item: any) => "Specialization",
        },
        occupation: {
            icon: Briefcase,
            label: "career paths",
            browseUrl: "/majors",
            getSlug: (item: any) => null, // Occupations usually open in a modal
            getSubtext: (item: any) => "Career Path",
        }
    }[type];

    const Icon = config.icon;

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500">No saved {config.label} yet.</p>
                {!compact && (
                    <Button asChild variant="link" className="mt-2 text-indigo-600">
                        <Link href={config.browseUrl}>Browse all {config.label}</Link>
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className={compact ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {items.map((item) => {
                const slug = config.getSlug(item);
                const CardWrapper = ({ children }: { children: React.ReactNode }) => {
                    if (onItemClick) {
                        return (
                            <div
                                onClick={() => onItemClick(item)}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all cursor-pointer text-left"
                            >
                                {children}
                            </div>
                        );
                    }
                    if (slug) {
                        return (
                            <Link
                                href={slug}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all"
                            >
                                {children}
                            </Link>
                        );
                    }
                    return (
                        <div className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                            {children}
                        </div>
                    );
                };

                return (
                    <CardWrapper key={item.id}>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-[10px] tracking-wider">
                                {item.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium">{config.getSubtext(item)}</p>
                        </div>
                        {(slug || onItemClick) && (
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        )}
                    </CardWrapper>
                );
            })}
        </div>
    );
}
