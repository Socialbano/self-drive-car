import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS } from '@/lib/constants';
import { BlogListClient } from './BlogListClient';
import { getAdminSettings, getBlogs, getActiveLocations } from '@/lib/supabase/queries';
import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings.business_site_url || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  const isDemo = siteConfig.urls.isDemo;

  const title = `Blog | ${name} ${city}`;
  const description = `Your ultimate guide to self-drive adventures in ${city} and beyond. Discover hidden routes, safety tips, and the best travel experiences.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${cleanSiteUrl}/blog`,
    },
    robots: isDemo ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: `${cleanSiteUrl}/blog`,
      siteName: name,
      type: 'website',
    },
  };
}

export default async function BlogPage() {
  const settings = await getAdminSettings();
  const city = settings.business_city || BUSINESS.city;
  
  const blogs = await getBlogs();
  let locations = await getActiveLocations();
  if (!locations || locations.length === 0) {
    locations = siteConfig.locations as any;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings.business_site_url || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanSiteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${cleanSiteUrl}/blog` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      
      <header className="bg-[#000615] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
         <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'var(--color-primary)' }}></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
         
         <div className="max-w-4xl mx-auto relative z-10 text-center">
            <nav className="flex justify-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
               <span>Home</span>
               <span className="mx-3 text-[#E89B10]">•</span>
               <span className="text-white">Blog</span>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-white font-headline tracking-tight mb-6">
               Your Ultimate Guide to <br className="hidden md:block" />
               <span className="bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">Self-Drive Adventures</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
               Discover hidden routes, safety tips, and the best travel experiences in and around {city}.
            </p>
         </div>
      </header>

      {/* Main Content Component */}
      <BlogListClient initialBlogs={blogs} locations={locations} />

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
