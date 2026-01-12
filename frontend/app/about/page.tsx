'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Users, Globe, Shield, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AboutPage() {
    const { isAuthenticated } = useAuth();
    const backHref = isAuthenticated ? "/dashboard" : "/";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fdfcff] via-[#F5F3FF] to-[#fdfcff] font-sans">
            {/* Navigation - Duplicating Home Nav Logic (Simplified for subpage) */}
            <nav className="border-b border-white/30 backdrop-blur-md bg-white/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F46E5]/30">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                                Majorly
                            </span>
                        </Link>

                    </div>

                    <div className="flex items-center gap-4">
                        {!isAuthenticated && (
                            <Button asChild className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 shadow-md shadow-[#4F46E5]/20 text-white px-6">
                                <Link href="/login">Sign In</Link>
                            </Button>
                        )}
                        {isAuthenticated && (
                            <Button asChild variant="outline" className="rounded-full border-2 hidden sm:flex">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                    <span className="text-indigo-600 font-semibold text-sm">OUR MISSION</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-[#1e293b] mb-6 tracking-tight">
                    Empowering Your <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">Academic Future</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    We believe every student deserves a future they're passionate about. Majorly combines data science with human-centric design to guide you there.
                </p>
            </section>

            {/* Values Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Target,
                            title: "Precision Matching",
                            desc: "We analyze over 33,000 skills and 900+ occupations to find the perfect alignment for your unique profile."
                        },
                        {
                            icon: Users,
                            title: "Student Centric",
                            desc: "Built with the student journey in mind. No complex jargon, just clear, actionable insights for your career path."
                        },
                        {
                            icon: Shield,
                            title: "Trusted Data",
                            desc: "Powered by official labor market data and academic research, ensuring our recommendations are grounded in reality."
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-all hover:scale-[1.02]">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team/Story Section */}
            <section className="py-20 bg-white/40 border-y border-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">Why I Built Majorly</h2>
                        <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                            <p>
                                Choosing a college major is one of the first big decisions in adulthood, yet many people around me either didn't know what to major in, or were unsure about their career path.
                            </p>
                            <p>
                                I experienced this first-hand—even I wasn't entirely sure about my own decision. Seeing this confusion and unsureness around me, I knew there was a need for a clearer path.
                            </p>
                            <p>
                                At the same time, I wanted to push the boundaries of modern development. I wanted to test my own prompt files for "vibe coding" and decided to put that energy into building something that helps others find their way.
                            </p>
                        </div>
                        <div className="pt-6 flex flex-wrap gap-4">
                            <Button asChild className="rounded-full bg-[#1e293b] text-white hover:bg-slate-800 px-8 py-6 text-lg">
                                <Link href="/assessment">
                                    Start Your Journey
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-full border-2 px-8 py-6 text-lg hover:bg-slate-50">
                                <a href="https://github.com/Nour-Al-Hazzouri/majorly" target="_blank" rel="noreferrer">
                                    View on GitHub
                                </a>
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-3xl" />
                        <div className="relative bg-gradient-to-br from-white to-indigo-50 p-2 rounded-[2rem] shadow-2xl rotate-2">
                            {/* Placeholder for a team image or abstract visual */}
                            <div className="aspect-square rounded-[1.8rem] bg-indigo-100 flex items-center justify-center overflow-hidden relative">
                                <div className="absolute inset-0 opacity-10 pattern-grid-lg text-indigo-500" />
                                <Globe className="w-32 h-32 text-indigo-300 opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Sources Section */}
            <section className="py-20 bg-slate-900 text-white border-y border-white/10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Powered by Trusted Data</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <a
                            href="https://www.onetonline.org/"
                            target="_blank"
                            rel="noreferrer"
                            className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-8 transition-all hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Globe className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                                <h3 className="text-xl font-bold group-hover:text-blue-300 transition-colors">O*NET OnLine</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                The nation's primary source of occupational information, sponsored by the U.S. Department of Labor.
                            </p>
                            <span className="text-sm font-semibold text-blue-400 flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                                Visit Website <ArrowRight className="w-4 h-4" />
                            </span>
                        </a>

                        <a
                            href="https://ec.europa.eu/esco/portal/home"
                            target="_blank"
                            rel="noreferrer"
                            className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-8 transition-all hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Target className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
                                <h3 className="text-xl font-bold group-hover:text-emerald-300 transition-colors">ESCO Portal</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                European Skills, Competences, Qualifications and Occupations taxonomy, providing a common language for the labor market.
                            </p>
                            <span className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                                Visit Website <ArrowRight className="w-4 h-4" />
                            </span>
                        </a>
                    </div>
                    <div className="mt-12 text-sm text-slate-500 max-w-3xl mx-auto space-y-4">
                        <p>
                            This project includes information from the O*NET 29.1 Database by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">CC BY 4.0</a> license. O*NET® is a trademark of USDOL/ETA. Majorly has modified all or some of this information. USDOL/ETA has not approved, endorsed, or tested these modifications.
                        </p>
                        <p>
                            This project uses the ESCO classification of the European Commission.
                        </p>
                        <p>
                            <strong className="text-slate-400">Note:</strong> Majorly is not affiliated with O*NET, ESCO, or any government agency. This project only uses their publicly accessible data to provide educational insights.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                    <p className="text-sm text-[#64748b]">
                        © 2026 Majorly. Powered by Modern Academic Insights.
                    </p>
                </div>
            </footer>
        </div>
    );
}
