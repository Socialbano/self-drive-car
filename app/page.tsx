import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCars } from '@/components/home/FeaturedCars';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { InstagramReels } from '@/components/home/InstagramReels';
import { Testimonials } from '@/components/home/Testimonials';
import { SpecialOffers } from '@/components/home/SpecialOffers';
import { CTABanner } from '@/components/home/CTABanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getAdminSettings, getTestimonials } from '@/lib/supabase/queries';
import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || siteConfig.brand.name;
  const city = settings.business_city || siteConfig.contact.city;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings.business_site_url || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  const isDemo = siteConfig.urls.isDemo;

  const title = settings.business_seo_title || `Self Drive Car in ${city} | Car Rental Without Driver | ${name}`;
  const description = settings.business_seo_description || `Book the best self drive cars in ${city} from ${name}. Hatchback, Sedan, and Luxury SUVs available on daily and monthly rent. Zero security deposit, 24/7 support.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${cleanSiteUrl}/`,
    },
    robots: isDemo ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: `${cleanSiteUrl}/`,
      siteName: name,
      type: 'website',
    },
  };
}

export default async function Home() {
  const testimonials = await getTestimonials();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      <FeaturedCars />
      <WhyChooseUs />
      <HowItWorks />
      <InstagramReels />
      <Testimonials initialTestimonials={testimonials} />
      <SpecialOffers />
      <CTABanner />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
