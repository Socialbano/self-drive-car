import { Navbar } from '@/components/layout/Navbar';
import { PremiumFleet } from '@/components/cars/PremiumFleet';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: `Self Drive Cars in Jaipur | Car Rental Jaipur | ${BUSINESS.name}`,
  description: 'Travel Jaipur in style with our self-drive car rental service. Affordable, reliable, and available 24/7. Book via WhatsApp with zero security deposit.',
  alternates: {
    canonical: '/locations/jaipur',
  },
};

export default function JaipurPage() {

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    description: 'Self-Drive Car Rental Service in Jaipur',
    url: 'https://www.skydeepgroup.com/locations/jaipur',
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jaipur',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
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
           <img src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80" alt="Jaipur Hawa Mahal Self Drive" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-[#E89B10]/20 text-[#E89B10] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-[#E89B10]/30 backdrop-blur-sm">
             <span className="material-symbols-outlined text-sm">location_on</span>
             Now Serving Jaipur
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6 leading-tight">
            Self Drive Cars in <span className="gradient-text">Jaipur</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Travel Jaipur in style with our self-drive car rental service. Affordable, reliable, and available 24/7. Explore the Pink City's forts, palaces, and markets at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href={whatsappLink('Hi Skydeepgroup! I want to book a self drive car in Jaipur.')} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg">
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
      <PremiumFleet locationName="Jaipur" title="Popular Cars in Jaipur" />

      {/* Why choose us city specific */}
      <section className="py-12 px-6 lg:px-8 bg-white -mt-10 mb-20 rounded-t-3xl relative z-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-3xl font-black text-[#0B1F3A] font-headline mb-6">Why Rent with Skydeep in Jaipur?</h2>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1152d4]">pin_drop</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-[#0B1F3A] text-lg mb-1">Pickup Across Jaipur</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">Convenient pickup locations across Jaipur including the Railway Station, Airport, and major hotels.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1152d4]">account_balance_wallet</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-[#0B1F3A] text-lg mb-1">Zero Security Deposit</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">Rent your favorite car without blocking your funds. We trust our customers.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1152d4]">auto_awesome</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-[#0B1F3A] text-lg mb-1">Clean & Sanitized</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">Every car undergoes a deep cleaning process before handed over to you.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80" alt="Skydeep Jaipur Fleet" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-[#0B1F3A]/40 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 text-center">
                     <h3 className="font-black text-white text-3xl mb-1">400+</h3>
                     <p className="text-white font-bold text-sm">Happy Jaipur Customers</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
