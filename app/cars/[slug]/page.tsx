import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getCarBySlug, getSimilarCars, getAdminSettings } from '@/lib/supabase/queries';
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import { normalizeCarSpecs } from '@/lib/car-utils';
import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [rawCar, settings] = await Promise.all([
    getCarBySlug(params.slug),
    getAdminSettings()
  ]);
  if (!rawCar) return { title: 'Car Not Found' };

  const car = normalizeCarSpecs(rawCar);
  const name = settings?.business_name || BUSINESS.name;
  const city = settings?.business_city || BUSINESS.city;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings?.business_site_url || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  const isDemo = siteConfig.urls.isDemo;

  return {
    title: `${car.name} Rental in ${city} | ${name}`,
    description: `Rent ${car.name} (${car.car_type}) in ${city} for ₹${car.price_24hr?.toLocaleString()}/24hrs. Zero security deposit, instant WhatsApp booking.`,
    alternates: {
      canonical: `${cleanSiteUrl}/cars/${car.slug}`,
    },
    robots: isDemo ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${car.name} Self Drive Rental in ${city} | ${name}`,
      description: `Rent ${car.name} (${car.car_type}) in ${city} for ₹${car.price_24hr?.toLocaleString()}/24hrs. Book instantly on WhatsApp.`,
      url: `${cleanSiteUrl}/cars/${car.slug}`,
      images: [car.image_url || `${cleanSiteUrl}/default-car.png`],
      type: 'website',
    },
  };
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const [rawCar, settings] = await Promise.all([
    getCarBySlug(params.slug),
    getAdminSettings()
  ]);
  
  if (!rawCar) {
    notFound();
  }

  const car = normalizeCarSpecs(rawCar);
  const name = settings.business_name || BUSINESS.name;
  const phone = settings.business_phone || BUSINESS.phone;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const city = settings.business_city || BUSINESS.city;

  const rawSimilarCars = await getSimilarCars(car.car_type, car.id);
  const similarCars = rawSimilarCars.map(c => normalizeCarSpecs(c));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings?.business_site_url || siteConfig.urls.siteUrl;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${car.name} Self Drive Rental`,
    image: car.image_url || `${cleanSiteUrl}/default-car.png`,
    description: car.description || `Rent ${car.name} self drive car in ${city}.`,
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanSiteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Cars', item: `${cleanSiteUrl}/cars` },
      { '@type': 'ListItem', position: 3, name: car.name, item: `${cleanSiteUrl}/cars/${car.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
                  src={car.image_url} 
                  alt={`${car.name} self drive rental in ${city}`}
                  className="w-full h-full object-cover rounded-2xl"
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
                  <p className="font-bold text-[#0B1F3A] capitalize">{car.transmission === 'automatic' ? 'Automatic' : 'Manual'}</p>
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
              <div className="bg-[#0B1F3A]/10 border border-[#0B1F3A]/20 rounded-2xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0B1F3A]">clean_hands</span>
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
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 bg-[#E89B10]"></div>
              
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
                        {car.km_limit_per_day ? `${car.km_limit_per_day} KM` : '300 KM'}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-white/60">Extra KM Rate</span>
                      <span className="text-white font-bold">
                        {car.extra_km_rate ? `₹${car.extra_km_rate} / KM` : '₹10 / KM'}
                      </span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-white/60">Security Deposit</span>
                      <span className="text-white font-bold">₹0 Deposit</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <a 
                    href={whatsappLink(WHATSAPP_MESSAGES.carBookingTime(car.name, '12 hours', car.price_12hr, name), whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-all duration-300 active:scale-95 shadow-lg shadow-[#25D366]/20"
                  >
                    <span className="material-symbols-outlined text-xl">chat</span>
                    Book for 12 Hours
                  </a>
                  <a 
                    href={whatsappLink(WHATSAPP_MESSAGES.carBookingTime(car.name, '24 hours', car.price_24hr, name), whatsappNumber)}
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

        {/* Similar Cars Section */}
        {similarCars && similarCars.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-150">
            <h3 className="text-2xl font-black text-[#0B1F3A] mb-8 font-headline">Similar Cars</h3>
            <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:pb-0">
              {similarCars.map((simCar) => (
                <div 
                  key={simCar.id} 
                  className="min-w-[280px] md:min-w-0 bg-white rounded-3xl border border-gray-100 p-4 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 snap-start"
                >
                  {/* Image Container */}
                  <div className="bg-[#F8F9FA] rounded-2xl aspect-[1.6] relative flex items-center justify-center overflow-hidden mb-4">
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-[#E89B10] flex items-center justify-center text-white shadow-sm z-10">
                      <span className="material-symbols-outlined text-base">directions_car</span>
                    </div>
                    {simCar.is_featured && (
                      <span className="absolute top-3 right-3 bg-[#0B1F3A] text-white px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider z-10 shadow-sm">
                        Featured
                      </span>
                    )}
                    <img 
                      src={simCar.image_url} 
                      alt={`${simCar.name} self drive rental`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-base font-bold text-[#0B1F3A] mb-3 leading-tight truncate px-1">
                    {simCar.name}
                  </h4>
                  
                  {/* Specifications */}
                  <div className="space-y-2.5 border-b border-gray-100 pb-4 mb-4 px-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#E89B10] text-[18px] font-bold">motion_photos_on</span>
                        <span>Gear Type</span>
                      </div>
                      <span className="font-bold text-[#0B1F3A] capitalize">{simCar.transmission === 'automatic' ? 'Automatic' : 'Manual'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#E89B10] text-[18px] font-bold">local_gas_station</span>
                        <span>Fuel Type</span>
                      </div>
                      <span className="font-bold text-[#0B1F3A] capitalize">{simCar.fuel_type}</span>
                    </div>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between mt-auto px-1">
                    <span className="text-[#0B1F3A] font-black text-lg">
                      ₹{simCar.price_24hr?.toLocaleString()}<span className="text-[10px] text-gray-400 font-normal">/day</span>
                    </span>
                    
                    <Link 
                      href={`/cars/${simCar.slug}`}
                      className="w-10 h-10 rounded-full bg-[#E89B10] hover:bg-[#0B1F3A] flex items-center justify-center text-[#0B1F3A] hover:text-white transition-all shadow-sm active:scale-95 hover:rotate-45"
                    >
                      <span className="material-symbols-outlined text-sm font-black">arrow_outward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
