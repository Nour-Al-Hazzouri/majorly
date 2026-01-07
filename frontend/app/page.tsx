'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles, Target, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "motion/react";

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcff] via-[#F5F3FF] to-[#fdfcff] font-sans">
      {/* Navigation */}
      <nav className="border-b border-white/30 backdrop-blur-md bg-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F46E5]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
              Majorly
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex text-[#64748b] hover:text-[#4F46E5]">How It Works</Button>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#1e293b] hidden md:inline">Welcome, {user?.name}</span>
                <Button variant="outline" className="rounded-full border-2" onClick={() => logout()}>Log Out</Button>
                <Button asChild className="rounded-full bg-[#4F46E5] hover:bg-[#4338CA]">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-[#64748b] hover:text-[#4F46E5]">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 shadow-md shadow-[#4F46E5]/20">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#4F46E5]/20">
              <Sparkles className="w-4 h-4 text-[#4F46E5]" />
              <span className="text-sm text-[#1e293b] font-medium">Free Assessment • 10 Minutes</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[#1e293b]">
              Find the Major{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                You'll Actually Love
              </span>
            </h1>

            <p className="text-xl text-[#64748b] leading-relaxed max-w-xl">
              Your personal academic concierge. Match your unique skills, interests, and aspirations
              to the perfect college major—backed by 33,000+ career data points.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 transition-all text-lg px-8 py-7 shadow-xl shadow-[#4F46E5]/25"
              >
                <Link href="/register">
                  Start Free Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-lg px-8 py-7 border-2 hover:bg-[#F5F3FF]"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5]/20 to-[#7C3AED]/20 rounded-3xl blur-3xl animate-pulse" />
            <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2rem] p-10 border border-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#4F46E5]" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-4 w-32 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full" />
                <div className="space-y-3">
                  <div className="h-3 w-56 bg-gray-100 rounded-full" />
                  <div className="h-3 w-40 bg-gray-100 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-5 pt-4">
                  {[
                    { label: "Computer Science", match: "94%", color: "bg-blue-50" },
                    { label: "Data Science", match: "87%", color: "bg-purple-50" },
                    { label: "Engineering", match: "82%", color: "bg-indigo-50" },
                    { label: "Mathematics", match: "79%", color: "bg-teal-50" },
                  ].map((item, i) => (
                    <div key={i} className={`p-5 ${item.color} rounded-2xl border border-white shadow-sm hover:scale-105 transition-transform`}>
                      <p className="text-xs font-semibold text-[#64748b] mb-1 uppercase tracking-wider">{item.label}</p>
                      <p className="text-3xl font-extrabold text-[#1e293b]">{item.match}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white/40 py-16 border-y border-white/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-black text-slate-800">FORBES</span>
          <span className="text-2xl font-black text-slate-800">TECHCRUNCH</span>
          <span className="text-2xl font-black text-slate-800">GAZEETE</span>
          <span className="text-2xl font-black text-slate-800">WIRED</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-sm text-[#64748b]">
            © 2026 Majorly. Powered by Modern Academic Insights.
          </p>
        </div>
      </footer>
    </div>
  );
}
