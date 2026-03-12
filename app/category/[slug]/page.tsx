import ToolCard from "@/components/ToolCard";
import FeaturedToolCard from "@/components/FeaturedToolCard";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
    return [
        { slug: 'ai-video' },
        { slug: 'ai-image' },
        { slug: 'ai-coding' },
        { slug: 'ai-marketing' },
        { slug: 'ai-writing' },
        { slug: 'ai-chat' },
        { slug: 'ai-voice' },
    ];
}

async function getCategoryTools(category: string) {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching category tools:', error);
        return [];
    }
    return data || [];
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const categoryName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const tools = await getCategoryTools(slug);
    const featuredTools = tools.filter(tool => tool.is_featured);
    const regularTools = tools.filter(tool => !tool.is_featured);

    return (
        <div className="space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-sm font-bold text-[#8B7E66] hover:text-indigo-600 transition-all mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Discovery</span>
                </Link>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight outfit text-[#3B362C]">
                    {categoryName} <span className="text-[#8B7E66]">Directory</span>
                </h1>
                <p className="text-[#6B6354] mt-6 max-w-2xl text-xl leading-relaxed">
                    Explore our elite selection of {categoryName} AI tools, meticulously curated for peak performance and innovation.
                </p>
            </div>

            {/* Featured category tools */}
            {featuredTools.length > 0 && (
                <div className="space-y-8">
                    <div className="flex items-center space-x-3 text-[#8B7E66]">
                        <Star className="h-5 w-5 fill-current" />
                        <h2 className="text-xl font-bold uppercase tracking-widest outfit">Top Rated in {categoryName}</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {featuredTools.map((tool: any) => (
                            <FeaturedToolCard key={tool.id} {...tool} />
                        ))}
                    </div>
                </div>
            )}

            {/* Regular category tools */}
            <div className="space-y-8">
                <h2 className="text-xl font-bold text-[#3B362C] border-b border-border pb-4 w-fit">All {categoryName} Tools</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {regularTools.length > 0 ? (
                        regularTools.map((tool: any) => (
                            <ToolCard key={tool.id} {...tool} />
                        ))
                    ) : featuredTools.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-[2rem] border-2 border-dashed border-border bg-muted/30">
                            <p className="text-[#8B7E66] font-medium text-lg">No tools discovered in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

