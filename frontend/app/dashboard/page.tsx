'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { BookOpen, Sparkles, Calendar, ArrowRight, Target } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDashboardData } from "@/lib/api";

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [primaryMatch, setPrimaryMatch] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getDashboardData();
                setStats(response.data.stats);
                setPrimaryMatch(response.data.primary_match);
                setHistory(response.data.history || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <main className="md:ml-64 p-8 flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            {/* Main Content */}
            <main className="md:ml-64 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
                        <p className="text-slate-500 text-sm">Here's what's happening with your academic journey.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {primaryMatch ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <h3 className="font-semibold text-slate-800 mb-2">Highest Affinity Match</h3>
                            <p className="text-3xl font-bold text-indigo-600">{primaryMatch.name}</p>
                            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${primaryMatch.affinity}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-indigo-500"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">{Number(primaryMatch.affinity).toFixed(1)}% Match Score</p>
                        </motion.div>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-indigo-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">No matches yet</p>
                            <Button asChild variant="link" className="text-indigo-600">
                                <Link href="/assessment">Start discovery</Link>
                            </Button>
                        </div>
                    )}

                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
                    >
                        <h3 className="font-semibold text-slate-800 mb-4">Your Activity</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-2xl font-bold text-slate-900">{stats?.assessments_completed || 0}</p>
                                <p className="text-xs text-slate-500">Assessments</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-2xl font-bold text-slate-900">
                                    {(stats?.majors_favorited || 0) + (stats?.specializations_favorited || 0) + (stats?.occupations_favorited || 0)}
                                </p>
                                <p className="text-xs text-slate-500">Favorites</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Assessment History Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Recent Assessments</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {history.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {history.map((assessment) => (
                                    <div key={assessment.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                {assessment.type === 'Deep Dive' ? <Target className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">
                                                    {assessment.type === 'Deep Dive' ? 'Deep Dive Analysis' : 'Personality Assessment'}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{assessment.date}</span>
                                                    </div>
                                                    {assessment.top_match && assessment.top_match !== 'Incomplete' && (
                                                        <>
                                                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300" />
                                                            <span className="text-indigo-600 font-medium">Top Match: {assessment.top_match}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-16 sm:pl-0">
                                            {assessment.score > 0 && (
                                                <div className="text-right">
                                                    <span className="block text-2xl font-black text-slate-900">{Number(assessment.score).toFixed(1)}%</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Match</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No assessments yet</h3>
                                <p className="max-w-xs mx-auto mb-6">Take your first assessment to see your history and matches here.</p>
                                <Button asChild className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                                    <Link href="/assessment">Start Assessment</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Keep Exploring */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 md:p-10 rounded-3xl shadow-xl shadow-indigo-500/20 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="font-extrabold text-2xl md:text-3xl mb-3 tracking-tight">Keep Exploring</h3>
                        <p className="text-indigo-100 text-lg font-medium max-w-xl">
                            Discover more majors and specializations to refine your academic profile and find your perfect fit.
                        </p>
                    </div>
                    <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold text-lg h-14 px-8 rounded-2xl shadow-lg shrink-0">
                        <Link href="/majors">Browse Majors</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
