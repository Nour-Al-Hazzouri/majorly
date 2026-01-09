'use client';

import { useState } from 'react';

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, BookOpen, Sparkles, User, Menu, X, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function Sidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            href: "/majors",
            label: "Browse Majors",
            icon: BookOpen,
        },
        {
            href: "/assessment",
            label: "Quick Assessment",
            icon: Sparkles,
            iconClassName: "text-indigo-500",
        },
        {
            href: "/dashboard/profile",
            label: "Profile",
            icon: User,
        },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col z-30">
                <Link href="/dashboard" className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F46E5]/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">Majorly</span>
                </Link>

                <nav className="space-y-2 flex-grow">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Button
                                key={item.href}
                                asChild
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 transition-colors",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
                                        : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                                )}
                            >
                                <Link href={item.href}>
                                    <Icon className={cn("w-5 h-5", item.iconClassName)} />
                                    {item.label}
                                </Link>
                            </Button>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100 space-y-2">
                    <Button
                        asChild
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3 transition-colors",
                            pathname === "/about"
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                        )}
                    >
                        <Link href="/about">
                            <Info className="w-5 h-5" />
                            About Us
                        </Link>
                    </Button>
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

            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">Majorly</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
                    <Menu className="w-6 h-6 text-slate-700" />
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-50 w-full max-w-[300px] bg-white shadow-2xl p-6 flex flex-col md:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xl font-bold text-slate-900">Menu</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                                    <X className="w-6 h-6 text-slate-500" />
                                </Button>
                            </div>

                            <nav className="space-y-2 flex-grow">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Button
                                            key={item.href}
                                            asChild
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start gap-4 text-lg h-12",
                                                isActive
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-slate-600"
                                            )}
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            <Link href={item.href}>
                                                <Icon className={cn("w-5 h-5", item.iconClassName)} />
                                                {item.label}
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </nav>

                            <div className="mt-auto pt-6 border-t border-slate-100 space-y-2">
                                <Button
                                    asChild
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-4 text-lg h-12",
                                        pathname === "/about"
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600"
                                    )}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <Link href="/about">
                                        <Info className="w-5 h-5" />
                                        About Us
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => logout()}
                                    className="w-full justify-start gap-3 text-red-600 text-lg"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Log Out
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
