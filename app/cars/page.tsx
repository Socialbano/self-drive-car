import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getCars, getAdminSettings } from '@/lib/supabase/queries';
import { CarsList } from '@/components/cars/CarsList';
import { BUSINESS } from '@/lib/constants';
import { siteConfig } from '@/config/site';
import { normalizeCarSpecs } from '@/lib/car-utils';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings.business_site_url || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  const isDemo = siteConfig.urls.isDemo;

  const title = `Our Premium Fleet | ${name} Car Rental ${city}`;
  const description = `Explore our wide range of premium self-drive cars in ${city}. Choose from hatchbacks, sedans, and luxury SUVs with zero security deposit options.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${cleanSiteUrl}/cars`,
    },
    robots: isDemo ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: `${cleanSiteUrl}/cars`,
      siteName: name,
      type: 'website',
    },
  };
}

export default async function CarsPage() {
  const rawCars = await getCars();
  const cars = rawCars.map(c => normalizeCarSpecs(c));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanSiteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Fleet', item: `${cleanSiteUrl}/cars` },
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
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
            <span>Home</span>
            <span className="mx-3 text-[#E89B10]">•</span>
            <span className="text-white">Our Fleet</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6">
            Choose Your <span className="bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">Journey</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            From nimble hatchbacks for city commutes to robust SUVs for weekend getaways, find the perfect vehicle for your next adventure.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
        <CarsList initialCars={cars} />
      </div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
