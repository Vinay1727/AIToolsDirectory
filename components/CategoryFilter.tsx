'use client';

import { useState } from 'react';
import { Search, X, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const TOP_CATEGORIES = [
    { id: 'ai-video', name: 'Video', icon: '🎬' },
    { id: 'ai-image', name: 'Images', icon: '🎨' },
    { id: 'ai-writing', name: 'Writing', icon: '✍️' },
];

const ALL_CATEGORIES = [
    { id: 'ai-video', name: 'AI Video & Animation' },
    { id: 'ai-image', name: 'AI Image & Art' },
    { id: 'ai-coding', name: 'AI Coding & Development' },
    { id: 'ai-writing', name: 'AI Writing & Content' },
    { id: 'ai-marketing', name: 'AI Marketing & SEO' },
    { id: 'ai-chat', name: 'AI Chatbots & LLMs' },
    { id: 'ai-voice', name: 'AI Voice & Audio' },
    { id: 'ai-productivity', name: 'AI Productivity & Life' },
    { id: 'ai-business', name: 'AI Business & Finance' },
    { id: 'ai-education', name: 'AI Education & Learning' },
    { id: 'ai-other', name: 'Other AI Tools' },
];

export default function CategoryFilter() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = ALL_CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative flex items-center space-x-3">
            {/* 3 Main Categories */}
            <AnimatePresence mode="wait">
                {!isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center space-x-2"
                    >
                        {TOP_CATEGORIES.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.id}`}
                                className="hidden sm:flex items-center space-x-2 rounded-full bg-white border border-[#E8E1D5] px-4 py-2 text-xs font-bold text-[#5C5446] hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm whitespace-nowrap"
                            >
                                <span>{cat.icon}</span>
                                <span className="uppercase tracking-widest">{cat.name}</span>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search/Explore Toggle */}
            <div className={cn(
                "relative flex items-center transition-all duration-300",
                isSearchOpen ? "w-full md:w-[300px]" : "w-auto"
            )}>
                <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={cn(
                        "z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all shadow-sm border",
                        isSearchOpen
                            ? "bg-[#3B362C] border-[#3B362C] text-white rotate-90"
                            : "bg-white border-[#E8E1D5] text-[#8B7E66] hover:bg-indigo-50 hover:text-indigo-600"
                    )}
                >
                    {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4 font-bold" />}
                </button>

                <AnimatePresence>
                    {isSearchOpen && (
                        <>
                            <motion.input
                                autoFocus
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: '100%', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                type="text"
                                placeholder="Search category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="absolute left-0 h-10 rounded-full border border-indigo-400 bg-white pl-12 pr-4 text-sm font-semibold text-[#1A1816] shadow-xl outline-none ring-4 ring-indigo-500/5"
                            />

                            {/* Dropdown Results */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-[1.5rem] border border-[#E8E1D5] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:left-0 md:right-auto"
                            >
                                <div className="max-h-[300px] overflow-y-auto py-2">
                                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A69980] border-b border-[#F5F1E8] mb-1">
                                        All Categories
                                    </div>
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.id}`}
                                                className="flex items-center justify-between px-5 py-3 text-sm font-bold text-[#5C5446] transition-all hover:bg-indigo-50 hover:text-indigo-600 border-b border-[#F5F1E8] last:border-0 group"
                                            >
                                                <span className="flex items-center">
                                                    <Zap className="h-3 w-3 mr-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {cat.name}
                                                </span>
                                                <ChevronRight className="h-3 w-3 opacity-30 group-hover:translate-x-1 group-hover:opacity-100 transition-all text-indigo-500" />
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="px-5 py-8 text-center text-xs font-bold text-[#9A8F7A]">
                                            No categories match your search
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
