'use client';

import { ExternalLink, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ToolCardProps {
    id: string;
    name: string;
    description: string;
    website_url: string;
    category: string;
    logo_url?: string;
}

export default function ToolCard({ id, name, description, website_url, category, logo_url }: ToolCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/30 flex flex-col h-full"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border bg-muted/30">
                    {logo_url ? (
                        <Image
                            src={logo_url}
                            alt={`${name} logo`}
                            fill
                            className="object-contain p-1 transition-transform group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-indigo-500/10 text-indigo-500 font-bold">
                            {name.charAt(0)}
                        </div>
                    )}
                </div>
                <Link
                    href={`/tool/${id}`}
                    className="rounded-full p-2 text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
                >
                    <ExternalLink className="h-5 w-5" />
                </Link>
            </div>

            <Link href={`/tool/${id}`} className="flex-1 block group">
                <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-indigo-600 transition-colors outfit">
                    {name}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                    {description}
                </p>
            </Link>

            <div className="mt-auto">
                <Link href={`/category/${category}`} className="flex items-center space-x-2 text-[10px] font-bold text-indigo-500/80 bg-indigo-500/5 px-2.5 py-1 rounded-lg w-fit border border-indigo-500/10 hover:bg-indigo-500/10 transition-colors">
                    <Tag className="h-3 w-3" />
                    <span className="uppercase tracking-widest">{category.replace('ai-', '')}</span>
                </Link>
            </div>
        </motion.div>
    );
}
