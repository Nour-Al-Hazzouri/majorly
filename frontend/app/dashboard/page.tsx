'use client';

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]" />
                    <span className="text-xl font-bold text-slate-900">Majorly</span>
                </div>

                <nav className="space-y-2 flex-grow">
                    <Button asChild variant="ghost" className="w-full justify-start gap-3 bg-indigo-50 text-indigo-700">
                        <Link href="/dashboard">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <Link href="/majors">
                            <BookOpen className="w-5 h-5" />
                            Browse Majors
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <Link href="/assessment">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            Quick Assessment
                        </Link>
                    </Button>
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        onClick={() => logout()}
                        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
                        <p className="text-slate-500 text-sm">Here's what's happening with your academic journey.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
                    >
                        <h3 className="font-semibold text-slate-800 mb-2">Primary Match</h3>
                        <p className="text-3xl font-bold text-indigo-600">Computer Science</p>
                        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[94%]" />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">94% Affinity Score</p>
                    </motion.div>

                    {/* Placeholder Cards */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <BookOpen className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">No recent assessments</p>
                        <Button asChild variant="link" className="text-indigo-600">
                            <Link href="/assessment">Start discovery</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
