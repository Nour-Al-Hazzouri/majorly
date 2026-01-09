import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fdfcff] via-[#F5F3FF] to-[#fdfcff] flex flex-col font-sans">
            {/* Header matches platform standard */}
            <nav className="border-b border-white/30 backdrop-blur-md bg-white/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group w-fit">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F46E5]/30 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                            Majorly
                        </span>
                    </Link>

                    <div className="flex items-center">
                        <Button asChild variant="ghost" className="rounded-full text-[#64748b] hover:text-[#4F46E5]">
                            <Link href="/about">About Us</Link>
                        </Button>
                    </div>
                </div>
            </nav>
            <div className="flex-grow w-full flex justify-center items-center py-12 px-4">
                {children}
            </div>
        </div>
    );
}
