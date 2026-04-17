import { Navbar } from '@/components/layout/Navbar';
import { PremiumFleet } from '@/components/cars/PremiumFleet';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: `Car Rental Bhawar Kua Indore | Self Drive Near Bhanwar Kuan | ${BUSINESS.name}`,
  description: 'Rent a self drive car near Bhanwar Kuan (Bhawarkua) Indore. SkydeepGroup offers hatchbacks, sedans, and SUVs with zero security deposit directly from our nearby office.',
  alternates: {
    canonical: '/locations/bhanwar-kuan',
  },
};

export default function BhanwarKuanPage() {

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    description: 'Self-Drive Car Rental Service in Bhanwar Kuan, Indore',
    url: 'https://www.skydeepgroup.com/locations/bhanwar-kuan',
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bhawarkua',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
  };

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
           <img src="https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80" alt="Bhanwar Kuan Indore" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-[#E89B10]/20 text-[#E89B10] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-[#E89B10]/30 backdrop-blur-sm">
             <span className="material-symbols-outlined text-sm">location_on</span>
             Pick up near Bhanwar Kuan
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6 leading-tight">
            Car Rental <span className="gradient-text">Bhanwar Kuan</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Looking for a self-drive car near Bhawarkua? SkydeepGroup is located right here! Get your vehicle instantly with zero security deposit.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href={whatsappLink('Hi Skydeepgroup! I want to book a car near Bhanwar Kuan.')} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg">
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
      <PremiumFleet locationName="Bhanwar Kuan" title="Popular Cars in Bhanwar Kuan" />

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
