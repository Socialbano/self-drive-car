import { Navbar } from '@/components/layout/Navbar';
import { PremiumFleet } from '@/components/cars/PremiumFleet';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import { getAdminSettings, getBlogsByLocation } from '@/lib/supabase/queries';
import { createClient } from '@supabase/supabase-js';
import { siteConfig, SiteLocation } from '@/config/site';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: {
    slug: string;
  };
}

async function resolveLocation(slug: string) {
  // 1. Check database
  try {
    const { data: dbLoc } = await supabaseServer
      .from('locations')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (dbLoc) {
      return {
        id: dbLoc.id,
        name: dbLoc.name,
        slug: dbLoc.slug,
        category: dbLoc.category || 'city',
        title: dbLoc.title || `Self Drive Car Rental in ${dbLoc.name} | ${siteConfig.brand.name}`,
        description: dbLoc.description || `Rent a self drive car in ${dbLoc.name}. Zero security deposit, 24/7 delivery.`,
        street_address: dbLoc.street_address || siteConfig.contact.address,
        hero_image: dbLoc.hero_image || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
        icon_name: dbLoc.icon_name || 'location_on',
        badge_text: dbLoc.badge_text || `Fast Delivery in ${dbLoc.name}`,
        heading_prefix: dbLoc.heading_prefix || 'Self Drive Car Rental in',
        heading_highlight: dbLoc.heading_highlight || dbLoc.name,
        hero_description: dbLoc.hero_description || `Enjoy premium self-drive car rentals delivered right to your doorstep in ${dbLoc.name}. Hatchbacks, sedans, and SUVs with zero security deposit.`,
        whatsapp_msg: dbLoc.whatsapp_msg || `Hi! I want to book a self drive car in ${dbLoc.name}.`,
      };
    }
  } catch (e) {
    // Silently proceed to fallback siteConfig
  }

  // 2. Fallback to siteConfig single source of truth
  const match = siteConfig.locations.find((l) => l.slug === slug);
  if (match) {
    return {
      id: match.id,
      name: match.name,
      slug: match.slug,
      category: match.category,
      title: match.title,
      description: match.description,
      street_address: match.streetAddress,
      hero_image: match.heroImage,
      icon_name: match.iconName,
      badge_text: match.badgeText,
      heading_prefix: match.headingPrefix,
      heading_highlight: match.headingHighlight,
      hero_description: match.heroDescription,
      whatsapp_msg: match.whatsappMsg,
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const location = await resolveLocation(params.slug);
  if (!location) {
    return { title: 'Location Not Found' };
  }

  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings.business_site_url || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  const isDemo = siteConfig.urls.isDemo;

  return {
    title: location.title || `Self Drive Car Rental ${location.name} | ${name}`,
    description: location.description || `Rent a self drive car in ${location.name}. Best rates, zero security deposit, instant delivery.`,
    alternates: {
      canonical: `${cleanSiteUrl}/locations/${location.slug}`,
    },
    robots: isDemo ? { index: false, follow: false } : undefined,
    openGraph: {
      title: location.title || `Self Drive Car Rental ${location.name} | ${name}`,
      description: location.description || `Rent a self drive car in ${location.name}. Best rates, zero security deposit, instant delivery.`,
      url: `${cleanSiteUrl}/locations/${location.slug}`,
      images: [location.hero_image],
      type: 'website',
    },
  };
}

export default async function LocationPage({ params }: PageProps) {
  const location = await resolveLocation(params.slug);

  if (!location) {
    notFound();
  }

  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const phone = settings.business_phone || BUSINESS.phone;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const relatedBlogs = await getBlogsByLocation(location.id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings.business_site_url || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: `${name} - ${location.name}`,
    description: location.description || `Self-Drive Car Rental Service in ${location.name}`,
    url: `${cleanSiteUrl}/locations/${location.slug}`,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.street_address,
      addressLocality: settings.business_city || BUSINESS.city,
      addressRegion: settings.business_state || BUSINESS.state,
      addressCountry: 'IN',
    },
    priceRange: '₹1200 - ₹5000',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanSiteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: `${cleanSiteUrl}/locations/${location.slug}` },
      { '@type': 'ListItem', position: 3, name: location.name, item: `${cleanSiteUrl}/locations/${location.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      
      {/* City Hero */}
      <header className="bg-gradient-to-br from-[#0B1F3A] to-[#0a1526] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20">
           <img 
             src={location.hero_image} 
             alt={`${location.name} self drive rental`} 
             className="w-full h-full object-cover" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-[#E89B10]/20 text-[#E89B10] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-[#E89B10]/30 backdrop-blur-sm">
             <span className="material-symbols-outlined text-sm">{location.icon_name}</span>
             {location.badge_text}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6 leading-tight">
            {location.heading_prefix}{' '}
            <span className="bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">
              {location.heading_highlight}
            </span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            {location.hero_description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a 
               href={whatsappLink(location.whatsapp_msg, whatsappNumber)} 
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
              <span className="inline-block bg-[#0B1F3A]/10 text-[#0B1F3A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
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
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#E89B10]">
                      {article.category}
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-2">{article.date}</p>
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="text-lg font-bold text-[#0B1F3A] mb-3 group-hover:text-[#E89B10] transition-colors line-clamp-2">
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
