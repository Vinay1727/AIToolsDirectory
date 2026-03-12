import { ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedToolCardProps {
    id: string;
    name: string;
    description: string;
    website_url: string;
    category: string;
    logo_url?: string;
}

export default function FeaturedToolCard({ id, name, description, website_url, category, logo_url }: FeaturedToolCardProps) {
    return (
        <div className="relative group overflow-hidden rounded-[2rem] bg-[#FDFBF7] p-8 border border-[#E9E1D1] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
            {/* Soft Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 bg-[#F3EFE7] blur-[70px] opacity-50 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="relative h-14 w-14 rounded-2xl bg-white p-2.5 shadow-sm border border-[#F0EBE0] flex items-center justify-center overflow-hidden">
                        {logo_url ? (
                            <Image
                                src={logo_url}
                                alt={name}
                                fill
                                className="object-contain p-2"
                                sizes="56px"
                            />
                        ) : (
                            <div className="h-full w-full bg-[#FAF7F2] flex items-center justify-center">
                                <span className="text-xl font-bold text-[#8B7E66]">{name[0]}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 rounded-full bg-[#F5F1E8] px-3 py-1 border border-[#EBE3D3]">
                        <Star className="h-3 w-3 text-[#A69980] fill-[#A69980]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6F5A]">Top Pick</span>
                    </div>
                </div>

                <Link href={`/tool/${id}`} className="block space-y-2 group/text">
                    <h3 className="text-2xl font-bold text-[#3B362C] outfit group-hover/text:text-indigo-600 transition-colors uppercase tracking-tight">{name}</h3>
                    <p className="text-[#6B6354] text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {description}
                    </p>
                </Link>

                <div className="flex items-center justify-between pt-2">
                    <Link href={`/category/${category}`} className="text-[11px] font-bold uppercase tracking-widest text-[#9A8F7A] bg-[#F7F3EB] px-3 py-1 rounded-lg hover:bg-[#F3EFE7] transition-colors">
                        {category.replace('ai-', '')}
                    </Link>
                    <Link
                        href={`/tool/${id}`}
                        className="flex items-center space-x-2 text-sm font-bold text-[#5A5346] hover:text-indigo-600 transition-colors group/btn"
                    >
                        <span>View Details</span>
                        <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
