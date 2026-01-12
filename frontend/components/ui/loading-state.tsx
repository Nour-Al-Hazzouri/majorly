'use client';

import React from 'react';
import { motion } from "motion/react";

export function LoadingState({ className = "min-h-[60vh]" }: { className?: string }) {
    const dotTransition = {
        repeat: Infinity,
        duration: 1,
        ease: "easeInOut" as const,
    };

    return (
        <div className={`flex w-full flex-col items-center justify-center gap-4 ${className}`}>
            <div className="flex items-center justify-center gap-2">
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        className="h-4 w-4 rounded-full bg-indigo-600"
                        animate={{
                            y: ["0%", "-100%", "0%"], // Jump higher (100% of height = 16px, or use pixels)
                        }}
                        transition={{
                            ...dotTransition,
                            delay: index * 0.2, // Stagger effect
                        }}
                        style={{ y: 0 }} // Initial state
                    />
                ))}
            </div>

            <p className="text-sm font-medium text-slate-500 animate-pulse">
                Getting your data from around the world
            </p>
        </div>
    );
}
