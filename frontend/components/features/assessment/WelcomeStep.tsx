'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ClipboardList, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeStepProps {
    onStart: () => void;
    isDeepDive?: boolean;
}

const WelcomeStep = ({ onStart, isDeepDive }: WelcomeStepProps) => {
    return (
        <Card className="border-white bg-white/70 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="text-center pt-12 pb-6 px-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-6"
                >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#4F46E5]/20">
                        <Sparkles className="h-10 w-10 text-white" />
                    </div>
                </motion.div>
                <CardTitle className="text-4xl font-extrabold tracking-tight text-[#1e293b] mb-4">
                    {isDeepDive ? 'Major Deep Dive' : 'Find Your Ideal Major'}
                </CardTitle>
                <CardDescription className="text-lg text-[#64748b] max-w-lg mx-auto leading-relaxed">
                    {isDeepDive
                        ? 'Explore specialized paths within your chosen major to find the perfect niche that matches your interests and strengths.'
                        : 'Quickly match your unique skills, interests, and aspirations to the perfect college major with our data-driven assessment.'}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 py-8 px-10">
                <div className="grid gap-8 max-w-md mx-auto">
                    <div className="flex items-start gap-5 group">
                        <div className="mt-1 bg-[#EEF2FF] p-3 rounded-2xl group-hover:scale-110 transition-transform">
                            <ClipboardList className="h-6 w-6 text-[#4F46E5]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-[#1e293b]">10 Minute Assessment</h4>
                            <p className="text-[#64748b]">A comprehensive yet quick evaluation of your academic profile.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5 group">
                        <div className="mt-1 bg-[#F5F3FF] p-3 rounded-2xl group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-6 w-6 text-[#7C3AED]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-[#1e293b]">Personalized Matching</h4>
                            <p className="text-[#64748b]">Get a curated list of top 5-7 majors tailored specifically to you.</p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pb-12 pt-6 flex flex-col items-center px-10">
                <Button
                    size="lg"
                    className="w-full sm:w-80 h-16 text-lg font-bold rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 transition-all shadow-xl shadow-[#4F46E5]/25"
                    onClick={onStart}
                >
                    {isDeepDive ? 'Start Deep Dive' : 'Start Free Assessment'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-[#94a3b8] mt-6 font-medium">
                    No account required • Instant results
                </p>
            </CardFooter>
        </Card>
    );
};

export default WelcomeStep;
