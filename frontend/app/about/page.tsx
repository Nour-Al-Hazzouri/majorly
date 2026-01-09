import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Users, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fdfcff] via-[#F5F3FF] to-[#fdfcff] font-sans">
            {/* Navigation - Duplicating Home Nav Logic (Simplified for subpage) */}
            <nav className="border-b border-white/30 backdrop-blur-md bg-white/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F46E5]/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                            Majorly
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button asChild className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 shadow-md shadow-[#4F46E5]/20 text-white px-6">
                            <Link href="/login">Sign In</Link>
                        </Button>
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
                        <h2 className="text-3xl font-bold text-slate-900">Why We Built Majorly</h2>
                        <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                            <p>
                                Choosing a college major is one of the first big decisions in adulthood, yet most students make it based on limited information or gut feeling.
                            </p>
                            <p>
                                We saw too many talented individuals switch majors late in their degree or graduate into careers they didn't enjoy. We knew there had to be a better way to connect personal strengths with professional purpose.
                            </p>
                            <p>
                                Majorly was born from this gap—a tool to illuminate the path forward, not just with data, but with a deep understanding of what makes work fulfilling.
                            </p>
                        </div>
                        <div className="pt-4">
                            <Button asChild className="rounded-full bg-[#1e293b] text-white hover:bg-slate-800 px-8 py-6 text-lg">
                                <Link href="/assessment">
                                    Start Your Journey
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
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
