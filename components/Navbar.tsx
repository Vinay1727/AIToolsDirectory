'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Video', href: '/category/ai-video' },
    { name: 'Image', href: '/category/ai-image' },
    { name: 'Writing', href: '/category/ai-writing' },
    { name: 'Chat', href: '/category/ai-chat' },
    { name: 'Voice', href: '/category/ai-voice' },
    { name: 'Coding', href: '/category/ai-coding' },
    { name: 'Marketing', href: '/category/ai-marketing' },
    { name: 'Submit', href: '/submit' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Zap className="h-8 w-8 text-indigo-600 fill-indigo-600" />
                            <span className="text-xl font-bold tracking-tight outfit text-foreground">AI Tools</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        'text-sm font-bold tracking-tight transition-all hover:text-indigo-600',
                                        pathname === link.href ? 'text-indigo-600' : 'text-muted-foreground'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-b border-border/50 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                    <div className="space-y-1 px-4 pb-4 pt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'block rounded-xl px-4 py-3 text-base font-bold outfit transition-all',
                                    pathname === link.href ? 'bg-indigo-50 text-indigo-600' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
