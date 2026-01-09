import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Skill {
    id: number;
    name: string;
    category: string;
}

interface SkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    skills: Skill[];
    type: 'technical' | 'soft';
}

export const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose, title, skills, type }) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-200"
                    >
                        {/* Header */}
                        <div className={cn(
                            "p-6 border-b flex items-center justify-between",
                            type === 'technical' ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                        )}>
                            <div className="flex items-center gap-3">
                                {type === 'technical' ? <Zap className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                                <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b bg-slate-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <ScrollArea className="flex-grow p-6">
                            <div className="flex flex-wrap gap-2">
                                {filteredSkills.length > 0 ? (
                                    filteredSkills.map((skill) => (
                                        <Badge
                                            key={`${skill.id}-${skill.name}`}
                                            variant="secondary"
                                            className={cn(
                                                "px-4 py-2 text-sm font-bold border-none shadow-sm",
                                                type === 'technical'
                                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            )}
                                        >
                                            {skill.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <div className="w-full py-12 text-center text-slate-400 italic">
                                        No skills found matching your search.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Footer */}
                        <div className="p-6 border-t bg-slate-50 flex justify-end">
                            <Button variant="outline" onClick={onClose} className="rounded-xl">
                                Close Window
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
