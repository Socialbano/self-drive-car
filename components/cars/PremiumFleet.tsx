import Link from 'next/link';
import { getFeaturedCars, getCars } from '@/lib/supabase/queries';
import { whatsappLink } from '@/lib/constants';
import type { Car } from '@/types';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600';

interface PremiumFleetProps {
  title?: string;
  subtitle?: string;
  locationName?: string;
}

function FeaturedCarCard({ car, locationName }: { car: Car, locationName?: string }) {
  const safeSlug = car.slug || '#';
  const carName = car.name || 'Vehicle';
  const carType = car.car_type || 'car';
  const fuelType = car.fuel_type || 'petrol';
  const transmission = car.transmission || 'manual';

  const whatsappMessage = locationName 
    ? `Hi! I want to book the ${carName} in ${locationName}.`
    : `Hi! I want to book the ${carName}. Is it available?`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(11,31,58,0.12)] hover:-translate-y-1 border border-gray-100">
      {/* Image */}
      <Link href={safeSlug !== '#' ? `/cars/${safeSlug}` : '#'} className="relative block h-56 overflow-hidden">
        <img
          alt={carName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          src={car.image_url || PLACEHOLDER_IMG}
        />

        {/* Type Badge */}
        <div className="absolute top-3 right-3 bg-[#0B1F3A]/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-semibold capitalize">
          {carType}
        </div>
      </Link>

      {/* Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-[#0B1F3A]">{carName}</h3>
          <div className="text-right flex flex-col gap-0.5 mt-[-4px]">
             <div className="flex items-baseline justify-end gap-1">
               <span className="text-sm font-semibold text-[#0B1F3A]">₹{car.price_12hr?.toLocaleString() ?? 0}</span>
               <span className="text-[10px] text-gray-500">/ 12 hrs</span>
             </div>
             <div className="flex items-baseline justify-end gap-1">
               <span className="text-xl font-black text-[#E89B10]">₹{car.price_24hr?.toLocaleString() ?? 0}</span>
               <span className="text-xs text-gray-400">/ 24 hrs</span>
             </div>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="flex flex-col items-center p-2.5 bg-gray-50 rounded-xl">
            <span className="material-symbols-outlined text-sm mb-1 text-gray-500">airline_seat_recline_extra</span>
            <span className="text-[10px] font-bold uppercase text-gray-400">{car.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center p-2.5 bg-gray-50 rounded-xl">
            <span className="material-symbols-outlined text-sm mb-1 text-gray-500">settings</span>
            <span className="text-[10px] font-bold uppercase text-gray-400">{transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
          </div>
          <div className="flex flex-col items-center p-2.5 bg-gray-50 rounded-xl">
            <span className="material-symbols-outlined text-sm mb-1 text-gray-500">local_gas_station</span>
            <span className="text-[10px] font-bold uppercase text-gray-400 capitalize">{fuelType}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <a
            href={whatsappLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            Book Now
          </a>
          <Link
            href={safeSlug !== '#' ? `/cars/${safeSlug}` : '#'}
            className="flex-1 bg-[#0B1F3A] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#0B1F3A]/90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function PremiumFleet({ 
  title = "Our Popular Cars", 
  subtitle = "Choose from our wide range of meticulously maintained vehicles, perfect for city drives or weekend getaways.", 
  locationName 
}: PremiumFleetProps) {
  let cars = await getFeaturedCars();

  // Fallback to latest cars if no featured cars
  if (!cars || cars.length === 0) {
    cars = await getCars();
  }

  // If still no cars in DB, show a helpful message
  if (!cars || cars.length === 0) {
    return (
      <section className="section-padding bg-[#f9f9f9]" id="cars">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
            <div>
              <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Premium Fleet</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2 tracking-tight">
                {title}
              </h2>
              <p className="text-gray-400 mt-3 max-w-md">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">directions_car</span>
            <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">Cars coming soon!</h3>
            <p className="text-gray-400">Our fleet is being prepared. Check back shortly.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-[#f9f9f9]" id="cars">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
          <div>
            <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Premium Fleet</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2 tracking-tight">
              {title}
            </h2>
            <p className="text-gray-400 mt-3 max-w-md">
              {subtitle}
            </p>
          </div>
          <Link
            href="/cars"
            className="flex items-center gap-2 text-[#0B1F3A] font-bold text-sm hover:text-[#E89B10] transition-colors group"
          >
            View All Cars
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.slice(0, 6).map((car) => (
            <FeaturedCarCard key={car.id} car={car} locationName={locationName} />
          ))}
        </div>
      </div>
    </section>
  );
}
