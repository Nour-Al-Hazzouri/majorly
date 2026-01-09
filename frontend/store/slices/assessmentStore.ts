import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, AssessmentSection, AssessmentResult, SpecializationResult } from '@/types';

interface AssessmentState {
    assessmentId: number | null;
    currentStep: number;
    sections: AssessmentSection[];
    responses: Record<string, any>;
    results: (AssessmentResult[] | SpecializationResult[]) | null;
    isSubmitting: boolean;
    activeMajorId: number | null;

    // Actions
    setAssessmentId: (id: number | null) => void;
    setActiveMajorId: (id: number | null) => void;
    setUserId: (id: number | null) => void;
    setSections: (sections: AssessmentSection[]) => void;
    setResponse: (questionId: string, value: any) => void;
    setResults: (results: (AssessmentResult[] | SpecializationResult[]) | null) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    setIsSubmitting: (status: boolean) => void;
    reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set) => ({
            assessmentId: null,
            activeMajorId: null,
            currentStep: 0,
            sections: [],
            responses: {},
            results: null,
            isSubmitting: false,
            userId: null,

            setAssessmentId: (id) => set({ assessmentId: id }),
            setActiveMajorId: (id) => set({ activeMajorId: id }),
            setUserId: (id) => set({ userId: id }),
            setSections: (sections) => set({ sections }),
            setResponse: (questionId, value) =>
                set((state) => ({
                    responses: { ...state.responses, [questionId]: value }
                })),
            setResults: (results) => set({ results }),
            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
            setStep: (step) => set({ currentStep: step }),
            setIsSubmitting: (status) => set({ isSubmitting: status }),
            reset: () => set({
                assessmentId: null,
                activeMajorId: null,
                currentStep: 0,
                responses: {},
                results: null,
                isSubmitting: false,
                userId: null
            }),
        }),
        {
            name: 'assessment-storage',
            partialize: (state) => ({
                assessmentId: state.assessmentId,
                activeMajorId: state.activeMajorId,
                responses: state.responses,
                currentStep: state.currentStep,
                results: state.results,
                userId: state.userId
            }),
        }
    )
);
