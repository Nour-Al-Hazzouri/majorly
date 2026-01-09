'use client';

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, BookOpen, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

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
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col">
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
    );
}
