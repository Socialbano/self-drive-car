import { Navbar } from '@/components/layout/Navbar';
import { PremiumFleet } from '@/components/cars/PremiumFleet';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: `Self Drive Car Rental Indore Airport | Airport Pickup | ${BUSINESS.name}`,
  description: 'Arriving at Devi Ahilya Bai Holkar Airport? SkydeepGroup provides instant self-drive car rental delivery at Indore airport. Zero security deposit.',
  alternates: {
    canonical: '/locations/airport',
  },
};

export default function AirportPage() {

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    description: 'Self-Drive Car Rental Service at Indore Airport',
    url: 'https://www.skydeepgroup.com/locations/airport',
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Devi Ahilya Bai Holkar Airport',
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
           <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80" alt="Indore Airport" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-[#E89B10]/20 text-[#E89B10] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-[#E89B10]/30 backdrop-blur-sm">
             <span className="material-symbols-outlined text-sm">flight_land</span>
             Indore Airport Delivery
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6 leading-tight">
            Car Rental <span className="gradient-text">Indore Airport</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Skip the taxi line. Step off your flight and straight into your pre-booked self-drive car at Devi Ahilya Bai Holkar Airport.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href={whatsappLink('Hi Skydeepgroup! I need a car rental delivery at Indore Airport.')} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg">
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
      <PremiumFleet locationName="Airport" title="Popular Cars at Indore Airport" />

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
