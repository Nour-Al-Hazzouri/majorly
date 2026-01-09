'use client';

import { useAuth } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { AssessmentHistory } from "@/components/features/dashboard/AssessmentHistory";
import { SavedItems } from "@/components/features/dashboard/SavedItems";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileForm } from "@/components/features/dashboard/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, History, Heart, Settings, LayoutDashboard, BookOpen, Layers, Briefcase } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab') || 'overview';

    const [profileData, setProfileData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(tabParam);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/profile');
            setProfileData(response.data.user);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Sync state with URL param
    useEffect(() => {
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [tabParam, activeTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`/dashboard/profile?tab=${value}`, { scroll: false });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <main className="md:ml-64 p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <Skeleton className="h-12 w-48" />
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className="md:ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
                        <p className="text-slate-500 mt-2">Manage your account and view your academic progress.</p>
                    </header>

                    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
                        <TabsList className="bg-slate-100 dark:bg-slate-100 p-1 rounded-xl inline-flex h-auto w-auto">
                            <TabsTrigger
                                value="overview"
                                className="rounded-lg px-4 py-2 gap-2 text-slate-600 dark:text-slate-600 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-white data-[state=active]:dark:text-indigo-600 transition-all font-medium"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="assessments"
                                className="rounded-lg px-4 py-2 gap-2 text-slate-600 dark:text-slate-600 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-white data-[state=active]:dark:text-indigo-600 transition-all font-medium"
                            >
                                <History className="w-4 h-4" />
                                Assessment History
                            </TabsTrigger>
                            <TabsTrigger
                                value="favorites"
                                className="rounded-lg px-4 py-2 gap-2 text-slate-600 dark:text-slate-600 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-white data-[state=active]:dark:text-indigo-600 transition-all font-medium"
                            >
                                <Heart className="w-4 h-4" />
                                Saved Items
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="rounded-lg px-4 py-2 gap-2 text-slate-600 dark:text-slate-600 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:dark:bg-white data-[state=active]:dark:text-indigo-600 transition-all font-medium"
                            >
                                <Settings className="w-4 h-4" />
                                Account Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Recent Assessments</h2>
                                    <AssessmentHistory assessments={profileData.assessments?.slice(0, 3)} compact />
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Saved Majors</h2>
                                    <SavedItems items={profileData.saved_majors?.slice(0, 4)} type="major" compact />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="assessments">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                <AssessmentHistory assessments={profileData.assessments} />
                            </div>
                        </TabsContent>

                        <TabsContent value="favorites">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-12">
                                <section>
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-600" />
                                        Saved Majors
                                    </h2>
                                    <SavedItems items={profileData.saved_majors} type="major" />
                                </section>

                                <section className="pt-8 border-t border-slate-100">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-indigo-600" />
                                        Saved Specializations
                                    </h2>
                                    <SavedItems items={profileData.saved_specializations} type="specialization" />
                                </section>

                                <section className="pt-8 border-t border-slate-100">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-indigo-600" />
                                        Saved Career Paths
                                    </h2>
                                    <SavedItems items={profileData.saved_occupations} type="occupation" />
                                </section>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
                                <h2 className="text-xl font-semibold text-slate-900 mb-6">Update Profile Information</h2>
                                <ProfileForm user={profileData} onUpdate={fetchProfile} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
