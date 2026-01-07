'use client';

import React from 'react';
import { useAssessmentStore, AssessmentSection } from '@/store/slices/assessmentStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RatingStepProps {
    section: AssessmentSection;
    onNext: () => void;
    onBack: () => void;
    isLastStep?: boolean;
    isSubmitting?: boolean;
}

const RatingStep = ({ section, onNext, onBack, isLastStep, isSubmitting }: RatingStepProps) => {
    const { responses, setResponse } = useAssessmentStore();

    const sectionResponses = responses[section.id] || {};

    const handleRate = (questionId: string, value: string) => {
        const updated = { ...sectionResponses, [questionId]: parseInt(value) };
        setResponse(section.id, updated);
    };

    const allAnswered = section.questions?.every(q => sectionResponses[q.id] !== undefined);

    return (
        <Card className="border-white bg-white/70 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="px-10 pt-10">
                <CardTitle className="text-3xl font-extrabold text-[#1e293b]">{section.title}</CardTitle>
                <CardDescription className="text-lg text-[#64748b] mt-2">{section.description}</CardDescription>
            </CardHeader>

            <CardContent className="px-10 py-6">
                <div className="space-y-10 py-4">
                    {section.questions?.map((question, idx) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="space-y-6 p-6 rounded-2xl bg-white/40 border border-white/50 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center text-sm font-bold border border-[#4F46E5]/10">
                                    {idx + 1}
                                </span>
                                <Label className="text-lg font-bold text-[#1e293b] leading-tight pt-1">
                                    {question.text}
                                </Label>
                            </div>

                            <div className="space-y-4">
                                <RadioGroup
                                    value={sectionResponses[question.id]?.toString()}
                                    onValueChange={(val) => handleRate(question.id, val)}
                                    className="flex items-center justify-between gap-1 max-w-md mx-auto"
                                >
                                    {[1, 2, 3, 4, 5].map((num) => {
                                        const isSelected = sectionResponses[question.id] === num;
                                        return (
                                            <div key={num} className="flex flex-col items-center gap-3">
                                                <RadioGroupItem
                                                    value={num.toString()}
                                                    id={`${question.id}-${num}`}
                                                    className={cn(
                                                        "h-10 w-10 border-2 transition-all duration-300",
                                                        isSelected ? "bg-[#4F46E5] border-[#4F46E5] scale-110 shadow-lg shadow-[#4F46E5]/30" : "border-[#E2E8F0] hover:border-[#4F46E5]/40"
                                                    )}
                                                />
                                                <Label
                                                    htmlFor={`${question.id}-${num}`}
                                                    className={cn(
                                                        "text-xs font-bold transition-colors",
                                                        isSelected ? "text-[#4F46E5]" : "text-[#94a3b8]"
                                                    )}
                                                >
                                                    {num}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                                <div className="flex justify-between px-4 text-[10px] uppercase tracking-[0.15em] text-[#94a3b8] font-black">
                                    <span>Below Average</span>
                                    <span>Excellent</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between px-10 pb-10 pt-6 border-t border-white/30 backdrop-blur-sm">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="rounded-full px-8 h-12 border-2 text-[#64748b] hover:bg-white"
                >
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!allAnswered || isSubmitting}
                    className="rounded-full px-10 h-12 font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] shadow-lg shadow-[#4F46E5]/20"
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        isLastStep ? 'Complete Assessment' : 'Continue'
                    )}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default RatingStep;
