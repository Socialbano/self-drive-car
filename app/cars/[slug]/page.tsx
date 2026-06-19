import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getCarBySlug, getSimilarCars } from '@/lib/supabase/queries';
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import { getAdminSettings } from '@/lib/supabase/queries';
import type { Metadata } from 'next';

// Dynamic page — no generateStaticParams needed (SSR fetches live from DB)
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [car, settings] = await Promise.all([
    getCarBySlug(params.slug),
    getAdminSettings()
  ]);
  if (!car) return { title: 'Car Not Found' };
  
  const name = settings?.business_name || BUSINESS.name;
  const siteUrl = settings?.business_site_url || 'https://selfdrivecarrental.in';
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');

    return {
      title: `${car.name} Rental Indore | ${name}`,
      description: `Rent ${car.name} (${car.car_type}) in Indore for ₹${car.price_24hr}/24hrs. Book instantly on WhatsApp.`,
      alternates: {
        canonical: `/cars/${params.slug}`,
      },
      openGraph: {
        title: `${car.name} Self Drive Rental Indore | ${name}`,
        description: `Rent ${car.name} (${car.car_type}) in Indore for ₹${car.price_24hr}/24hrs. Book instantly on WhatsApp.`,
        images: [car.image_url || `${cleanSiteUrl}/default-car.png`],
        type: 'website',
      },
    };
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const [car, settings] = await Promise.all([
    getCarBySlug(params.slug),
    getAdminSettings()
  ]);
  
  if (!car) {
    notFound();
  }

  const name = settings.business_name || BUSINESS.name;
  const phone = settings.business_phone || BUSINESS.phone;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;

  const similarCars = await getSimilarCars(car.car_type, car.id);

  const siteUrl = settings?.business_site_url || 'https://selfdrivecarrental.in';
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${car.name} Self Drive Rental`,
    image: car.image_url || `${cleanSiteUrl}/default-car.png`,
    description: car.description || `Rent ${car.name} self drive car in Indore.`,
    brand: {
      '@type': 'Brand',
      name: name,
    },
    offers: {
      '@type': 'Offer',
      price: car.price_24hr,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${cleanSiteUrl}/cars/${car.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-sm font-semibold text-gray-400">
          <Link href="/" className="hover:text-[#0B1F3A]">Home</Link>
          <span className="mx-2">•</span>
          <Link href="/cars" className="hover:text-[#0B1F3A]">Fleet</Link>
          <span className="mx-2">•</span>
          <span className="text-[#0B1F3A]">{car.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
          {/* Left Column - Images & Details */}
          <div className="space-y-8">
            {/* Main Image */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-6 left-6 z-10 flex gap-2">
                <span className="bg-[#0B1F3A]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {car.car_type}
                </span>

              </div>
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <img 
                  src={car.image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80'} 
                  alt={`${car.name} self drive rental in Indore`}
                  className="w-full h-full object-cover rounded-2xl mix-blend-multiply"
                />
              </div>
            </div>

            {/* Specifications Details */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100">
              <h2 className="text-2xl font-black text-[#0B1F3A] mb-6 font-headline">Technical Specs</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <span className="material-symbols-outlined text-gray-400 mb-2">airline_seat_recline_extra</span>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Seats</p>
                  <p className="font-bold text-[#0B1F3A]">{car.seats} Person</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <span className="material-symbols-outlined text-gray-400 mb-2">local_gas_station</span>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Fuel</p>
                  <p className="font-bold text-[#0B1F3A] capitalize">{car.fuel_type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <span className="material-symbols-outlined text-gray-400 mb-2">settings</span>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Transmission</p>
                  <p className="font-bold text-[#0B1F3A] capitalize">{car.transmission}</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#E89B10]/10 border border-[#E89B10]/20 rounded-2xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#E89B10]">verified</span>
                <div>
                  <h4 className="font-bold text-[#0B1F3A] text-sm">Fully Insured</h4>
                  <p className="text-xs text-gray-500">Comprehensive cover</p>
                </div>
              </div>
              <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-2xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-accent)]">clean_hands</span>
                <div>
                  <h4 className="font-bold text-[#0B1F3A] text-sm">Sanitized</h4>
                  <p className="text-xs text-gray-500">Before every trip</p>
                </div>
              </div>
              <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#25D366]">support_agent</span>
                <div>
                  <h4 className="font-bold text-[#0B1F3A] text-sm">24/7 Support</h4>
                  <p className="text-xs text-gray-500">Roadside assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Booking */}
          <div className="space-y-6">
            <div className="bg-[#0B1F3A] rounded-3xl p-8 shadow-2xl relative overflow-hidden sticky top-32">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'var(--color-accent)' }}></div>
              
              <div className="relative z-10">
                <h1 className="text-3xl font-black text-white font-headline mb-2">{car.name}</h1>
                <p className="text-white/60 text-sm mb-8">{car.description || 'Premium self-drive vehicle in perfect condition.'}</p>

                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 backdrop-blur-md">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Rental Options</p>
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-center justify-between border border-white/10 p-3 rounded-xl bg-white/5">
                      <span className="text-white/80 font-medium">12 Hours</span>
                      <span className="text-2xl font-black text-[#E89B10]">₹{car.price_12hr?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border border-white/10 p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">24 Hours</span>
                      </div>
                      <span className="text-3xl font-black text-[#E89B10]">₹{car.price_24hr?.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 pt-4 border-t border-white/10">
                    <li className="flex justify-between text-sm">
                      <span className="text-white/60">KM Limit / Day</span>
                      <span className="text-white font-bold">
                        {car.km_limit_per_day ? `${car.km_limit_per_day} KM` : '—'}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-white/60">Extra KM Rate</span>
                      <span className="text-white font-bold">
                        {car.extra_km_rate ? `₹${car.extra_km_rate} / KM` : '—'}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-white/60">Security Deposit</span>
                      <span className="text-white font-bold">₹0 (Subject to check)</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <a 
                    href={whatsappLink(WHATSAPP_MESSAGES.carBookingTime(car.name, '12 hours', car.price_12hr), whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-all duration-300 active:scale-95 shadow-lg shadow-[#25D366]/20"
                  >
                    <span className="material-symbols-outlined text-xl">chat</span>
                    Book for 12 Hours
                  </a>
                  <a 
                    href={whatsappLink(WHATSAPP_MESSAGES.carBookingTime(car.name, '24 hours', car.price_24hr), whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#E89B10] text-[#0B1F3A] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d08c0e] hover:text-white transition-all duration-300 active:scale-95 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-xl">event_available</span>
                    Book for 24 Hours
                  </a>
                  <a 
                    href={`tel:${phone}`}
                    className="w-full bg-white text-[#0B1F3A] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-300 active:scale-95"
                  >
                    <span className="material-symbols-outlined">call</span>
                    Call to Book
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
