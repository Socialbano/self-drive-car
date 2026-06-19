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

// Always fetch fresh data from DB
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import type { Metadata } from 'next';
import { getAdminSettings, getTestimonials } from '@/lib/supabase/queries';
import { BUSINESS } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  return {
    title: `Self Drive Car in ${city} | Car Rental Without Driver | ${name}`,
    description: `Book the best self drive cars in ${city} from ${name}. Hatchback, Sedan, and Luxury SUVs available on daily and monthly rent. Zero security deposit, 24/7 support.`,
    alternates: {
      canonical: '/',
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

