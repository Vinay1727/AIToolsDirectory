import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Tools Directory | Discover Best AI Apps",
  description: "Curated directory of the latest and most powerful AI tools for video, image, coding, and marketing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <div className="relative min-h-screen">
          <div className="hero-glow" />
          <Navbar />
          <main className="container mx-auto min-h-[calc(100vh-64px)] px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="border-t border-white/5 py-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AI Tools Directory. Built for the future.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

