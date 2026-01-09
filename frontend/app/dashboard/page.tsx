'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDashboardData } from "@/lib/api";

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [primaryMatch, setPrimaryMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getDashboardData();
                setStats(response.data.stats);
                setPrimaryMatch(response.data.primary_match);
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {primaryMatch ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <h3 className="font-semibold text-slate-800 mb-2">Primary Match</h3>
                            <p className="text-3xl font-bold text-indigo-600">{primaryMatch.name}</p>
                            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${primaryMatch.affinity}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-indigo-500"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">{primaryMatch.affinity}% Affinity Score</p>
                        </motion.div>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">No primary match yet</p>
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

                    {/* Placeholder for Recent Activity or Tips */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Keep Exploring</h3>
                            <p className="text-indigo-100 text-sm">Discover more majors and specializations to refine your profile.</p>
                        </div>
                        <Button asChild className="bg-white text-indigo-600 hover:bg-indigo-50 mt-4 w-full border-none">
                            <Link href="/majors">Browse Majors</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
