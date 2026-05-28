import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS } from '@/lib/constants';

import { getAdminSettings } from '@/lib/supabase/queries';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  return {
    title: `About Us | ${name}`,
    description: `${city}'s premier self-drive car rental company providing reliable, insured, and sanitized vehicles with zero security deposit.`,
    alternates: {
      canonical: '/about',
    },
  };
}

export default async function AboutPage() {
  const settings = await getAdminSettings();
  const address = settings.business_address || BUSINESS.address;
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  
  const offerings = [
    {
      icon: 'star',
      title: 'Luxury Fleet',
      description: 'From premium sedans to capable SUVs, our diverse fleet is constantly updated to ensure you drive the best.'
    },
    {
      icon: 'support_agent',
      title: '24/7 Roadside Assist',
      description: 'Peace of mind guaranteed. We are always just a phone call away in case of any emergencies.'
    },
    {
      icon: 'money_off',
      title: 'No Hidden Fees',
      description: 'Transparent pricing with no surprise charges. What you see during booking is exactly what you pay.'
    },
    {
      icon: 'business_center',
      title: 'Business Solutions',
      description: 'Special monthly rental packages customized for corporate travel and long-term requirements.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <Navbar />
      
      {/* Hero Header */}
      <header className="bg-[#000615] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1152d4] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
            <span>Home</span>
            <span className="mx-3 text-[#E89B10]">•</span>
            <span className="text-white">About Us</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6">
            Our <span className="gradient-text">Story</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Learn more about our mission to provide the ultimate driving freedom.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline">Driven by Trust.<br/> Fueled by Quality.</h2>
            <p className="text-gray-500 leading-relaxed">
              At {name || 'our company'}, our mission is to empower travelers with high-quality, sanitized, and reliable self-drive vehicles. We believe that a journey should be as beautiful as the destination, and that starts with having complete control over your steering wheel.
            </p>
             <p className="text-gray-500 leading-relaxed flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-6">
               <span className="material-symbols-outlined text-[#1152d4] text-3xl">location_on</span>
               <span>Proudly based in <strong>{address}</strong>, deeply connected to the local travel ecosystem.</span>
             </p>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80" 
                alt={`${name || 'Self Drive Car'} Fleet in ${city}`} 
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000615]/80 to-transparent flex items-end p-8">
                <div>
                  <p className="text-white font-bold text-2xl">1,500+ Trips Completed</p>
                  <p className="text-white/60">Since our inception in 2019</p>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#25D366]">thumb_up</span>
                </div>
                <div>
                  <p className="text-[#0B1F3A] font-black text-xl">4.9/5</p>
                  <p className="text-gray-400 text-sm font-medium">Customer Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Offerings Core values */}
        <div className="text-center mb-16">
          <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Features</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2">Our Core Offerings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerings.map((offering, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0B1F3A] transition-colors duration-300">
                  <span className="material-symbols-outlined text-[#0B1F3A] group-hover:text-white text-3xl transition-colors">{offering.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">{offering.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{offering.description}</p>
             </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-gradient-to-br from-[#0B1F3A] to-[#1152d4] rounded-3xl p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-3xl font-black text-white mb-6 relative z-10">Ready to hit the road?</h2>
          <a href="/cars" className="inline-flex items-center gap-2 bg-white text-[#0B1F3A] px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform relative z-10">
            Explore Our Fleet
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
