import ToolCard from "@/components/ToolCard";
import FeaturedToolCard from "@/components/FeaturedToolCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Sparkles, ArrowRight, Star, Zap } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // Revalidate every hour

async function getTools() {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const allTools = await getTools();
  const featuredTools = allTools.filter(tool => tool.is_featured);
  const regularTools = allTools.filter(tool => !tool.is_featured);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-8 pt-16">
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="h-3.5 w-3.5 fill-indigo-400" />
          <span className="uppercase tracking-wider">Curated AI Excellence</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight outfit">
            Discover the <span className="gradient-text">Best AI Tools</span>
          </h1>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-xl md:text-2xl font-bold text-[#3B362C]">
              Submit your AI tool for free
            </p>
            <p className="text-lg text-muted-foreground font-medium">
              Get featured for more visibility
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/submit"
              className="rounded-full bg-indigo-500 px-10 py-4 text-base font-bold text-white transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-95"
            >
              Submit a Tool
            </Link>
            <Link
              href="#explore"
              className="group flex items-center space-x-2 text-sm font-bold text-[#5C5446] hover:text-indigo-600 transition-colors"
            >
              <span>Explore Directory</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-200 bg-amber-50/50 px-5 py-2 text-sm font-bold text-amber-700 shadow-sm">
            <Zap className="h-4 w-4 fill-amber-700" />
            <span>Featured Listing just $29</span>
          </div>
        </div>
      </section>

      {/* Featured Tools Section - Minimalist Light Mode */}
      {featuredTools.length > 0 && (
        <section className="relative -mx-4 px-4 py-20 bg-[#FAF9F6] border-y border-[#EAE6DD]/50 overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F3F0E8] rounded-full blur-[100px] opacity-60 -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F3F0E8] rounded-full blur-[100px] opacity-60 -ml-32 -mb-32" />

          <div className="max-w-7xl mx-auto space-y-12 relative z-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex items-center space-x-2 text-[#8B7E66] font-bold tracking-widest uppercase text-xs">
                <Star className="h-4 w-4 fill-current" />
                <span>Featured Selection</span>
                <Star className="h-4 w-4 fill-current" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3B362C] outfit">
                Curated <span className="text-[#8B7E66]">Top Picks</span>
              </h2>
              <p className="text-[#7A6F5A] max-w-xl">
                The most innovative and high-performance AI tools selected by our experts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool: any) => (
                <FeaturedToolCard key={tool.id} {...tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section id="explore" className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight outfit text-[#1A1816]">Explore Directory</h2>
            <p className="text-[#5C5446] mt-1 font-medium">Discover hundreds of AI tools across all categories.</p>
          </div>
          <CategoryFilter />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {regularTools.length > 0 ? (
            regularTools.map((tool: any) => (
              <ToolCard key={tool.id} {...tool} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
              <p className="text-muted-foreground text-lg">No additional tools available for now.</p>
              <Link href="/submit" className="mt-4 inline-block text-indigo-400 font-bold hover:underline">
                Submit the first one!
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
