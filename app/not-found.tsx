import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full" />
                <h1 className="text-[12rem] font-bold leading-none tracking-tighter outfit text-[#E8E1D5] select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="h-20 w-20 text-indigo-600 mb-4" />
                </div>
            </div>

            <div className="space-y-4 max-w-md mx-auto relative px-4">
                <h2 className="text-3xl md:text-4xl font-bold outfit tracking-tight text-[#3B362C]">
                    Oops! <span className="text-indigo-600">Lost in Space?</span>
                </h2>
                <p className="text-[#6B6354] text-lg font-medium">
                    The page you're looking for doesn't exist or has been moved to a premium directory.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                <Link
                    href="/"
                    className="flex items-center space-x-2 rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 group"
                >
                    <Home className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                    <span>Go back home</span>
                </Link>
                <Link
                    href="/"
                    className="flex items-center space-x-2 rounded-full border border-border bg-white px-8 py-3 text-sm font-bold text-[#3B362C] transition-all hover:bg-[#F3EFE7] active:scale-95"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Discovery</span>
                </Link>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
