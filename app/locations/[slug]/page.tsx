import { Navbar } from '@/components/layout/Navbar';
import { PremiumFleet } from '@/components/cars/PremiumFleet';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import { getAdminSettings, getBlogsByLocation } from '@/lib/supabase/queries';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Create a direct supabase server client to avoid client-side env warnings in static params generation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: location } = await supabaseServer
    .from('locations')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!location) {
    return {};
  }

  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;

  return {
    title: location.title || `Self Drive Car Rental ${location.name} | ${name}`,
    description: location.description || `Rent a self drive car in ${location.name}. Best rates, zero security deposit, instant delivery.`,
    alternates: {
      canonical: `/locations/${location.slug}`,
    },
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { data: location } = await supabaseServer
    .from('locations')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!location) {
    notFound();
  }

  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const phone = settings.business_phone || BUSINESS.phone;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const relatedBlogs = await getBlogsByLocation(location.id);

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name,
    description: location.description || `Self-Drive Car Rental Service in ${location.name}`,
    url: `${(settings.business_site_url || 'https://selfdrivecarrental.in').replace(/\/$/, '')}/locations/${location.slug}`,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.street_address || location.name,
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
  };

  const defaultHeroImage = 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80';

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <Navbar />
      
      {/* City Hero */}
      <header className="bg-gradient-to-br from-[#0B1F3A] to-[#0a1526] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20">
           <img 
             src={location.hero_image || defaultHeroImage} 
             alt={`${location.name} Indore`} 
             className="w-full h-full object-cover" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-[#E89B10]/20 text-[#E89B10] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-[#E89B10]/30 backdrop-blur-sm">
             <span className="material-symbols-outlined text-sm">{location.icon_name || 'location_on'}</span>
             {location.badge_text || `Fast Delivery in ${location.name}`}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6 leading-tight">
            {location.heading_prefix || 'Self Drive Car Rental in'}{' '}
            <span className="gradient-text">{location.heading_highlight || location.name}</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            {location.hero_description || `Enjoy premium self-drive car rentals delivered right to your doorstep in ${location.name}. Hatchbacks, sedans, and SUVs with zero security deposit.`}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a 
               href={whatsappLink(location.whatsapp_msg || `Hi! I want to book a self drive car in ${location.name}.`, whatsappNumber)} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg"
             >
                <span className="material-symbols-outlined">chat</span>
                Book on WhatsApp
             </a>
             <Link href="/cars" className="bg-white text-[#0B1F3A] px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors">
                View All Cars
             </Link>
          </div>
        </div>
      </header>

      {/* Premium Fleet Block */}
      <PremiumFleet locationName={location.name} title={location.category === 'city' ? `Popular Cars in ${location.name}` : `Popular Cars at ${location.name}`} />

      {/* Related Blogs Block */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="inline-block bg-[#1152d4]/10 text-[#1152d4] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                Local Insights
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] tracking-tight">
                Related Guides & Travel Tips
              </h2>
              <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">
                Explore our handpicked travel guides and driving tips to make the most of your self-drive rental in {location.name}.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.slice(0, 3).map((article: any) => (
                <article key={article.id} className="bg-[#f9f9f9] rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:bg-white transition-all duration-300 group flex flex-col h-full">
                  <Link href={`/blog/${article.slug}`} className="block aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#1152d4]">
                      {article.category}
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-2">{article.date}</p>
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="text-lg font-bold text-[#0B1F3A] mb-3 group-hover:text-[#1152d4] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto">
                      <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-2 text-[#E89B10] font-bold text-xs hover:gap-3 transition-all">
                        Read Guide <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
