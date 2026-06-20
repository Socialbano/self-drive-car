import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getCars } from '@/lib/supabase/queries';
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import { Car } from '@/types';

import { getAdminSettings } from '@/lib/supabase/queries';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  return {
    title: `Self Drive Car ${city} Price | Daily & Monthly Rates | ${name}`,
    description: `Simple and transparent self-drive car rental pricing in ${city}. View daily, weekly, and weekend rates for our entire fleet with zero hidden charges.`,
    alternates: {
      canonical: '/pricing',
    },
  };
}

function PricingTable({ cars, title }: { cars: Car[]; title: string }) {
  if (!cars || cars.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-2xl font-black text-[#0B1F3A] font-headline">{title}</h3>
        <div className="h-px bg-gray-200 flex-grow"></div>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-5">Vehicle</th>
                <th className="px-6 py-5">Transmission</th>
                <th className="px-6 py-5 text-[#E89B10]">12 Hours</th>
                <th className="px-6 py-5 text-[#E89B10]">24 Hours</th>
                <th className="px-6 py-5 hidden md:table-cell">Security Deposit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                        <img 
                          src={car.image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80'} 
                          alt={`${car.name} self drive car indore price`} 
                          loading="lazy"
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      </div>
                      <span className="font-bold text-[#0B1F3A] group-hover:text-[var(--color-accent)] transition-colors">{car.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold capitalize">
                      {car.transmission}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-[var(--color-primary)]">₹{car.price_12hr?.toLocaleString()}</td>
                  <td className="px-6 py-5 font-black text-[#E89B10]">₹{car.price_24hr?.toLocaleString()}</td>
                  <td className="px-6 py-5 font-semibold text-gray-600 hidden md:table-cell">₹0 (T&C Apply)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default async function PricingPage() {
  const [cars, settings] = await Promise.all([
    getCars(),
    getAdminSettings()
  ]);
  
  const name = settings.business_name || BUSINESS.name;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  
  const hatchbacks = cars.filter(c => c.car_type === 'hatchback');
  const sedans = cars.filter(c => c.car_type === 'sedan');
  const suvs = cars.filter(c => c.car_type === 'suv' || c.car_type === 'luxury' || c.car_type === 'muv');

  const policies = [
    {
      icon: 'receipt_long',
      title: 'Transparent Billing',
      desc: 'No hidden fees. What you see is exactly what you pay.'
    },
    {
      icon: 'refresh',
      title: 'Refundable Deposit',
      desc: 'Instant deposit refund upon successful return of the vehicle.'
    },
    {
      icon: 'local_gas_station',
      title: 'Fuel Policy',
      desc: 'Level-to-level. Return with the same fuel level you received.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <Navbar />
      
      <header className="bg-[#000615] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'var(--color-primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
            <span>Home</span>
            <span className="mx-3 text-[#E89B10]">•</span>
            <span className="text-white">Pricing</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6">
            Simple & Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Honest daily and weekly rates. All rentals include basic insurance and zero hidden fees. Drive more, worry less.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full relative z-20">
        
        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-[#E89B10] to-[#FFD700] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-[#E89B10]/10 mb-16 -mt-32 border border-white/20">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm -shrink-0">
              <span className="material-symbols-outlined text-white text-3xl">sell</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#0B1F3A] mb-1">Weekly Special</h3>
              <p className="text-[#0B1F3A]/80 font-medium">Book for 7+ days and get 15% off your total rental cost.</p>
            </div>
          </div>
          <a filter-id="promo" href={whatsappLink('Hi! I want to claim the 15% weekly booking discount.', whatsappNumber)} target="_blank" rel="noopener noreferrer" className="bg-[#0B1F3A] text-white px-8 py-3 rounded-xl font-bold whitespace-nowrap hover:bg-[#0B1F3A]/90 transition-all active:scale-95 shadow-lg w-full md:w-auto text-center">
            Claim Offer
          </a>
        </div>

        {/* Pricing Tables */}
        <div className="space-y-4">
          <PricingTable cars={hatchbacks} title="Hatchbacks" />
          <PricingTable cars={sedans} title="Sedans" />
          <PricingTable cars={suvs} title="SUVs & 4x4s" />
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 mb-8">
          {policies.map((policy, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[var(--color-accent)]">{policy.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-[#0B1F3A] mb-2">{policy.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{policy.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Quote CTA */}
        <div className="bg-[#0B1F3A] rounded-3xl p-10 md:p-16 text-center mt-8 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10">
             <h3 className="text-3xl font-black text-white font-headline mb-4">Planning a Long Trip?</h3>
             <p className="text-white/60 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
               We offer customized packages for outstation trips, weddings, and long-term rentals. Send us your requirements to get a special quote.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
               <a 
                 href={whatsappLink(`Hi ${name}! I need a custom quote for a long trip.`, whatsappNumber)} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-all hover:-translate-y-1 shadow-xl shadow-[#25D366]/20"
               >
                 <span className="material-symbols-outlined">chat</span>
                 Request Custom Quote
               </a>
             </div>
           </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
