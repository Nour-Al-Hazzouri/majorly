'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getMajors } from '@/lib/api';
import { MajorCard } from '@/components/features/majors/MajorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { debounce } from 'lodash';

const CATEGORIES = [
    'All',
    'Technology',
    'Business',
    'Health',
    'Engineering',
    'Arts',
    'Social Sciences',
    'Science',
];

export default function MajorsPage() {
    const [majors, setMajors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const fetchMajors = async (page = 1, search = '', category = 'All') => {
        try {
            setLoading(true);
            const params: any = { page };
            if (search) params.search = search;
            if (category !== 'All') params.category = category;

            const response = await getMajors(params);
            setMajors(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Error fetching majors:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((term: string, category: string) => {
            fetchMajors(1, term, category);
        }, 500),
        []
    );

    useEffect(() => {
        fetchMajors(1, searchTerm, selectedCategory);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value, selectedCategory);
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        fetchMajors(1, searchTerm, category);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchMajors(newPage, searchTerm, selectedCategory);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFM]">
            {/* Header Section */}
            <section className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Explore Majors</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                                Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Future</span>
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl">
                                Browse through our comprehensive database of academic majors. Find detailed information about required skills, career paths, and salary expectations.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search majors by name or keyword..."
                                className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-blue-600"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide md:pb-0">
                            <SlidersHorizontal className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                            {CATEGORIES.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    className={`rounded-full px-5 h-10 flex-shrink-0 transition-all ${selectedCategory === category
                                            ? 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200'
                                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <p className="text-slate-500 font-medium font-sans">Finding the best matches for you...</p>
                    </div>
                ) : majors.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                            {majors.map((major) => (
                                <MajorCard
                                    key={major.id}
                                    name={major.name}
                                    slug={major.slug}
                                    category={major.category}
                                    description={major.description}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl"
                                    disabled={pagination.current_page === 1}
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900">Page {pagination.current_page}</span>
                                    <span className="text-sm text-slate-400">of {pagination.last_page}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl"
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-24 space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300">
                            <Search className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">No majors found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            We couldn't find any majors matching your current filters. Try searching for something else or clearing your filters.
                        </p>
                        <Button
                            variant="link"
                            className="text-blue-600 font-semibold"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                                fetchMajors(1, '', 'All');
                            }}
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}
