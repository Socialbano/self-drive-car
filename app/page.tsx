import { HeroSection } from '@/components/home/HeroSection';

import { FeaturedCars } from '@/components/home/FeaturedCars';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { InstagramReels } from '@/components/home/InstagramReels';
import { Testimonials } from '@/components/home/Testimonials';
import { CTABanner } from '@/components/home/CTABanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

// Always fetch fresh data from DB
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const metadata = {
  title: 'Self Drive Car in Indore | Car Rental Without Driver | SkydeepGroup',
  description: 'Book the best self drive cars in Indore. Hatchback, Sedan, and Luxury SUVs available on daily and monthly rent. Zero security deposit, 24/7 support.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      <FeaturedCars />
      <WhyChooseUs />
      <HowItWorks />
      <InstagramReels />
      <Testimonials />
      <CTABanner />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
