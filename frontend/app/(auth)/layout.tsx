import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center p-4">
            <div className="w-full flex justify-center items-center">
                {children}
            </div>
        </div>
    );
}
