'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, Loader2, Send, Zap, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const submitSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    description: z.string().min(20, 'Please provide a detailed description'),
    websiteUrl: z.string().url('Please enter a valid URL'),
    category: z.string().min(1, 'Please select a category'),
    logoUrl: z.string().url('Please enter a valid URL for the logo').optional().or(z.literal('')),
    email: z.string().email('Please enter a valid email'),
});

type SubmitFormData = z.infer<typeof submitSchema>;

type ListingType = 'free' | 'featured';

const CATEGORIES = [
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

export default function SubmitPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [listingType, setListingType] = useState<ListingType>('free');

    // Category Selector State
    const [categorySearch, setCategorySearch] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<SubmitFormData>({
        resolver: zodResolver(submitSchema),
    });

    const selectedCategory = watch('category');

    const filteredCategories = CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const onSubmit = async (data: SubmitFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, listingType }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Submission failed');

            if (result.checkoutUrl) {
                window.location.href = result.checkoutUrl;
                return;
            }

            setIsSuccess(true);
            reset();
            setCategorySearch('');
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Failed to submit tool. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-8 py-20 animate-in zoom-in duration-500">
                <div className="rounded-full bg-indigo-100 p-6 shadow-xl shadow-indigo-500/10">
                    <CheckCircle2 className="h-16 w-16 text-indigo-600" />
                </div>
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold outfit text-[#1A1816]">Submission Success!</h1>
                    <p className="text-[#4A443A] text-lg max-w-md mx-auto leading-relaxed">
                        Your tool has been added to our review queue. Featured listings will be activated immediately after verification.
                    </p>
                </div>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="rounded-full border border-[#E8E1D5] bg-white px-10 py-4 font-bold text-[#5C5446] hover:bg-[#F3EFE7] transition-all shadow-sm active:scale-95"
                >
                    Submit another tool
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-16 py-12 px-4 animate-in fade-in duration-700">
            <div className="space-y-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center space-x-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest"
                >
                    <Sparkles className="h-4 w-4 fill-indigo-600" />
                    <span>Founder Submission Portal</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-bold tracking-tight outfit text-[#13110F]"
                >
                    Launch <span className="text-indigo-600">Your Product</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[#4A443A] text-xl max-w-2xl mx-auto leading-relaxed font-bold"
                >
                    Join the world's most elite directory of high-performance AI tools.
                </motion.p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
                <div className="bg-[#FDFBF7] border border-[#E9E1D1] rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.02)]">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C5446] ml-2">
                                Tool Name
                            </label>
                            <input
                                {...register('name')}
                                className={cn(
                                    "w-full rounded-[1.25rem] border border-[#E8E1D5] bg-white px-6 py-5 outline-none transition-all placeholder:text-[#8B7E66] focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-500/5 text-[#1A1816] font-semibold",
                                    errors.name && "border-red-300 ring-red-500/5 focus:ring-red-500/5"
                                )}
                                placeholder="e.g. Jasper AI"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C5446] ml-2">
                                Category
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={categorySearch}
                                    onFocus={() => setIsCategoryOpen(true)}
                                    onChange={(e) => {
                                        setCategorySearch(e.target.value);
                                        setIsCategoryOpen(true);
                                    }}
                                    onBlur={() => {
                                        // Small delay to allow click on items
                                        setTimeout(() => setIsCategoryOpen(false), 200);
                                    }}
                                    className={cn(
                                        "w-full rounded-[1.25rem] border border-[#E8E1D5] bg-white px-6 py-5 outline-none transition-all placeholder:text-[#8B7E66] focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-500/5 text-[#1A1816] font-semibold",
                                        errors.category && "border-red-300 ring-red-500/5 focus:ring-red-500/5"
                                    )}
                                    placeholder={selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : "Search category (e.g. Video, Writing)"}
                                />
                                <input type="hidden" {...register('category')} />

                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B7E66] transition-transform">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {/* Search Results Dropdown */}
                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute z-50 w-full mt-3 bg-white border border-[#E8E1D5] rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden max-h-[280px] overflow-y-auto"
                                        >
                                            {filteredCategories.length > 0 ? (
                                                filteredCategories.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setValue('category', cat.id);
                                                            setCategorySearch(cat.name);
                                                            setIsCategoryOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-6 py-4 text-sm font-semibold transition-all hover:bg-indigo-50 hover:text-indigo-600 border-b border-[#F5F1E8] last:border-0",
                                                            selectedCategory === cat.id ? "bg-indigo-50 text-indigo-600" : "text-[#5A5346]"
                                                        )}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-6 py-10 text-center text-[#5C5446] text-sm font-bold">
                                                    No categories matching "{categorySearch}"
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {errors.category && <p className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.category.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C5446] ml-2">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows={5}
                            className={cn(
                                "w-full rounded-[1.5rem] border border-[#E8E1D5] bg-white px-6 py-5 outline-none transition-all placeholder:text-[#8B7E66] focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-500/5 text-[#1A1816] font-semibold leading-relaxed",
                                errors.description && "border-red-300 ring-red-500/5"
                            )}
                            placeholder="Tell us about your tool... What makes it unique?"
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C5446] ml-2">
                                Website URL
                            </label>
                            <input
                                {...register('websiteUrl')}
                                className={cn(
                                    "w-full rounded-[1.25rem] border border-[#E8E1D5] bg-white px-6 py-5 outline-none transition-all placeholder:text-[#8B7E66] focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-500/5 text-[#1A1816] font-semibold",
                                    errors.websiteUrl && "border-red-300 ring-red-500/5"
                                )}
                                placeholder="https://jasper.ai"
                            />
                            {errors.websiteUrl && <p className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.websiteUrl.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C5446] ml-2">
                                Founder Email
                            </label>
                            <input
                                {...register('email')}
                                className={cn(
                                    "w-full rounded-[1.25rem] border border-[#E8E1D5] bg-white px-6 py-5 outline-none transition-all placeholder:text-[#8B7E66] focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-500/5 text-[#1A1816] font-semibold",
                                    errors.email && "border-red-300 ring-red-500/5"
                                )}
                                placeholder="founder@ai-tools.com"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1 ml-2 font-bold">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C5446] ml-2">
                            Logo URL (Optional)
                        </label>
                        <input
                            {...register('logoUrl')}
                            className="w-full rounded-[1.25rem] border border-[#E8E1D5] bg-white px-6 py-5 outline-none transition-all placeholder:text-[#8B7E66] focus:border-indigo-400 focus:ring-[6px] focus:ring-indigo-500/5 text-[#1A1816] font-semibold"
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                </div>

                {/* Listing Type Selection */}
                <div className="space-y-8">
                    <div className="space-y-3 text-center sm:text-left ml-2">
                        <h2 className="text-3xl font-bold outfit text-[#1A1816]">Choose Listing Plan</h2>
                        <p className="text-[#4A443A] font-bold">Select a plan to maximize your tool's exposure.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Free Listing Card */}
                        <div
                            onClick={() => setListingType('free')}
                            className={cn(
                                "relative cursor-pointer group rounded-[2.5rem] border p-10 transition-all duration-500",
                                listingType === 'free'
                                    ? "bg-white border-[#E8E1D5] shadow-2xl shadow-black/5 ring-[12px] ring-black/[0.02] scale-[1.02]"
                                    : "bg-transparent border-[#E8E1D5]/50 hover:bg-white hover:border-[#E8E1D5]"
                            )}
                        >
                            <div className="flex flex-col h-full space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-2xl bg-[#F5F1E8] p-4 border border-[#EBE3D3]">
                                        <Globe className="h-7 w-7 text-[#5C5446]" />
                                    </div>
                                    {listingType === 'free' && (
                                        <div className="rounded-full bg-indigo-50 p-2 border border-indigo-100">
                                            <CheckCircle2 className="h-6 w-6 text-indigo-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold outfit text-[#1A1816]">Basic Directory</h3>
                                    <p className="text-[#4A443A] font-bold leading-relaxed">
                                        Standard listing in our general tool database.
                                    </p>
                                </div>
                                <div className="mt-auto pt-6 border-t border-[#E8E1D5]/50">
                                    <span className="text-4xl font-bold outfit text-[#1A1816]">Free</span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Listing Card */}
                        <div
                            onClick={() => setListingType('featured')}
                            className={cn(
                                "relative cursor-pointer group rounded-[2.5rem] border p-10 transition-all duration-500 overflow-hidden",
                                listingType === 'featured'
                                    ? "bg-white border-indigo-500 shadow-2xl shadow-indigo-500/10 ring-[12px] ring-indigo-500/5 scale-[1.02]"
                                    : "bg-transparent border-[#E8E1D5]/50 hover:bg-white hover:border-[#E8E1D5]"
                            )}
                        >
                            {/* Premium Glow */}
                            <div className={cn(
                                "absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-indigo-500/10 blur-[80px] transition-opacity duration-500",
                                listingType === 'featured' ? "opacity-100" : "opacity-0"
                            )} />

                            <div className="flex flex-col h-full space-y-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-2xl bg-indigo-50 p-4 border border-indigo-100">
                                        <Zap className="h-7 w-7 text-indigo-600 fill-indigo-600/10" />
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20">
                                            Premium
                                        </span>
                                        {listingType === 'featured' && (
                                            <div className="rounded-full bg-indigo-50 p-2 border border-indigo-100">
                                                <CheckCircle2 className="h-6 w-6 text-indigo-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold outfit text-[#1A1816] flex items-center">
                                        Featured Listing <Sparkles className="h-5 w-5 ml-2 text-indigo-500" />
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Homepage Hero Section Feature',
                                            'Top-of-Category Permanent Rank',
                                            'Exclusive Gold Verified Badge',
                                            'Social Media Spotlight'
                                        ].map((benefit, i) => (
                                            <li key={i} className="flex items-center text-sm font-bold text-[#3B362C]">
                                                <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full mr-3" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-auto pt-6 border-t border-[#E8E1D5]/50 flex items-baseline space-x-2">
                                    <span className="text-5xl font-bold outfit text-indigo-600">$29</span>
                                    <span className="text-[#5C5446] font-bold text-sm uppercase tracking-widest">One-Time Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "w-full flex items-center justify-center space-x-3 rounded-[1.5rem] px-8 py-6 text-center font-bold text-lg transition-all focus:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl",
                        listingType === 'featured'
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30"
                            : "bg-[#3B362C] text-white hover:bg-black shadow-black/10"
                    )}
                >
                    {isSubmitting ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <>
                            <span>
                                {listingType === 'featured' ? 'Activate Premium Listing' : 'Submit Tool for Review'}
                            </span>
                            {listingType === 'featured'
                                ? <Zap className="h-6 w-6 fill-current" />
                                : <Send className="h-5 w-5 group-hover:translate-x-1.5 group-hover:-translate-y-0.5 transition-transform" />
                            }
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
