import { supabase } from '@/lib/supabase';
import { ArrowLeft, ExternalLink, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ToolCard from '@/components/ToolCard';

export const revalidate = 3600; // Revalidate every hour

async function getTool(id: string) {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

async function getRelatedTools(category: string, currentId: string) {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category', category)
        .neq('id', currentId)
        .limit(4);

    if (error) return [];
    return data || [];
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tool = await getTool(id);

    if (!tool) {
        notFound();
    }

    const relatedTools = await getRelatedTools(tool.category, id);

    return (
        <div className="max-w-6xl mx-auto space-y-16 py-10 px-4 animate-in fade-in duration-700">
            {/* Breadcrumb / Back */}
            <Link
                href="/"
                className="inline-flex items-center space-x-2 text-sm font-bold text-[#8B7E66] hover:text-indigo-600 transition-all group"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Directory</span>
            </Link>

            {/* Main Tool Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Icon & CTA */}
                <div className="space-y-8">
                    <div className="relative h-32 w-32 rounded-3xl bg-white border border-[#E8E1D5] shadow-xl flex items-center justify-center overflow-hidden p-4">
                        {tool.logo_url ? (
                            <Image
                                src={tool.logo_url}
                                alt={tool.name}
                                fill
                                className="object-contain p-6"
                                sizes="128px"
                                priority
                            />
                        ) : (
                            <div className="h-full w-full bg-[#FAF7F2] flex items-center justify-center">
                                <span className="text-4xl font-bold text-[#8B7E66]">{tool.name[0]}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Link
                            href={tool.website_url}
                            target="_blank"
                            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 px-8 py-5 text-center font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 group"
                        >
                            <span>Launch Tool</span>
                            <ExternalLink className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                        <p className="text-center text-xs text-[#9A8F7A] font-medium uppercase tracking-widest">
                            Official Website Link
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E9E1D1] space-y-4">
                        <div className="flex items-center space-x-2 text-[#8B7E66]">
                            <Tag className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#A69980]">Category</span>
                        </div>
                        <Link
                            href={`/category/${tool.category}`}
                            className="block text-lg font-bold text-[#3B362C] hover:text-indigo-600 transition-colors"
                        >
                            {tool.category.replace('ai-', '').toUpperCase()}
                        </Link>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-[#8B7E66]">
                            <Sparkles className="h-5 w-5 fill-[#8B7E66]" />
                            <span className="text-sm font-bold uppercase tracking-widest">Premium AI Insight</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-[#3B362C] outfit">{tool.name}</h1>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-xl font-bold text-[#8B7E66] outfit mb-4">About this tool</h2>
                        <p className="text-[#6B6354] text-xl leading-relaxed whitespace-pre-wrap">
                            {tool.description}
                        </p>
                    </div>

                    <div className="pt-10 border-t border-[#E8E1D5]">
                        <div className="flex items-center space-x-4 text-sm text-[#9A8F7A]">
                            <div className="flex items-center space-x-1">
                                <span className="font-bold">Status:</span>
                                <span className="text-green-600 font-bold uppercase tracking-tighter">Verified</span>
                            </div>
                            <span className="w-1 h-1 bg-[#E8E1D5] rounded-full" />
                            <div className="flex items-center space-x-1">
                                <span className="font-bold">Added:</span>
                                <span>{new Date(tool.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggestions Section */}
            {relatedTools.length > 0 && (
                <div className="pt-20 space-y-10 border-t border-[#E8E1D5]">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-[#3B362C] outfit">You might also like</h2>
                        <p className="text-[#7A6F5A]">Explore more cutting-edge tools in the {tool.category.replace('ai-', '')} category.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedTools.map((related: any) => (
                            <ToolCard key={related.id} {...related} />
                        ))}
                    </div>
                    <div className="flex justify-center pt-4">
                        <Link
                            href={`/category/${tool.category}`}
                            className="bg-[#F3EFE7] border border-[#E9E1D1] px-8 py-3 rounded-full font-bold text-[#8B7E66] hover:bg-[#EAE6DD] transition-all"
                        >
                            View all {tool.category.replace('ai-', '')} tools
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
