import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getCars, getAdminSettings } from '@/lib/supabase/queries';
import { CarsList } from '@/components/cars/CarsList';
import { BUSINESS } from '@/lib/constants';
import type { Metadata } from 'next';

// Always fetch fresh data from DB
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  return {
    title: `Our Premium Fleet | ${name} Car Rental ${city}`,
    description: `Explore our wide range of premium self-drive cars in ${city}. Choose from hatchbacks, sedans, and luxury SUVs with zero security deposit options.`,
    alternates: {
      canonical: '/cars',
    },
  };
}

export default async function CarsPage() {
  const cars = await getCars();

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <Navbar />
      
      {/* Page Header */}
      <header className="bg-[#000615] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1152d4] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
            <span>Home</span>
            <span className="mx-3 text-[#E89B10]">•</span>
            <span className="text-white">Our Fleet</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6">
            Choose Your <span className="gradient-text">Journey</span>
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
