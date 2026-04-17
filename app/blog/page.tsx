import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS } from '@/lib/constants';
import { BlogListClient } from './BlogListClient';

export const metadata = {
  title: `Blog | ${BUSINESS.name}`,
  description: 'Your ultimate guide to self-drive adventures in Indore and beyond. Discover hidden routes, safety tips, and the best travel experiences.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <Navbar />
      
      {/* Page Header */}
      <header className="bg-[#000615] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
         <div className="absolute top-0 right-0 w-96 h-96 bg-[#1152d4] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
         
         <div className="max-w-4xl mx-auto relative z-10 text-center">
            <nav className="flex justify-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
               <span>Home</span>
               <span className="mx-3 text-[#E89B10]">•</span>
               <span className="text-white">Blog</span>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-white font-headline tracking-tight mb-6">
               Your Ultimate Guide to <br className="hidden md:block" />
               <span className="gradient-text">Self-Drive Adventures</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
               Discover hidden routes, safety tips, and the best travel experiences in and around Indore.
            </p>
         </div>
      </header>

      {/* Main Content Component */}
      <BlogListClient />

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
