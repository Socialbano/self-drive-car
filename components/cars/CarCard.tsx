'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Fuel, Settings2, Phone, MessageCircle } from 'lucide-react';
import { Car } from '@/types';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { WHATSAPP_MESSAGES } from '@/lib/constants';
import { useSettings } from '@/components/SettingsProvider';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const { settings } = useSettings();
  const imageUrl = getCloudinaryUrl(car.image_url, { width: 600, height: 400, crop: 'auto' });
  const safeSlug = car.slug || '#';
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.carBooking(car.name))}`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Container */}
      <Link href={safeSlug !== '#' ? `/cars/${safeSlug}` : '#'} className="relative block aspect-[3/2] overflow-hidden group">
        <Image
          src={imageUrl}
          alt={car.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
           {car.is_featured && (
             <Badge variant="success" className="bg-[#E89B10] text-[#0B1F3A] shadow-sm border-0">Featured</Badge>
           )}
        </div>
        <div className="absolute top-3 left-3">
           <Badge variant="default" className="uppercase tracking-wider text-[10px] font-bold shadow-sm shadow-black/10">
              {car.car_type}
           </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={safeSlug !== '#' ? `/cars/${safeSlug}` : '#'}>
          <h3 className="font-heading font-bold text-xl text-primary mb-1 hover:text-accent transition-colors">
            {car.name}
          </h3>
        </Link>
        
        {/* Specs Row */}
        <div className="flex items-center text-sm text-gray-500 gap-4 mt-3 mb-5 border-b border-gray-100 pb-5">
          <div className="flex items-center" title="Seats">
            <Users className="w-4 h-4 mr-1 text-gray-400" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center capitalize" title="Fuel Type">
            <Fuel className="w-4 h-4 mr-1 text-gray-400" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center capitalize" title="Transmission">
            <Settings2 className="w-4 h-4 mr-1 text-gray-400" />
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Pricing Options</p>
              <div className="flex flex-col gap-0.5">
                <p className="font-heading font-medium text-[#0B1F3A] text-lg">
                  ₹{car.price_12hr?.toLocaleString() ?? 0} <span className="text-xs text-gray-500 font-normal">/ 12 hrs</span>
                </p>
                <p className="font-heading font-bold text-accent text-xl">
                  ₹{car.price_24hr?.toLocaleString() ?? 0} <span className="text-xs text-gray-500 font-normal">/ 24 hrs</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              href={`tel:${settings.phone}`}
              variant="secondary"
              className="w-full text-sm font-semibold h-11"
              leftIcon={<Phone className="w-4 h-4" />}
            >
              Call
            </Button>
            <Button
              href={whatsappLink}
              variant="whatsapp"
              className="w-full text-sm font-semibold h-11 shadow-sm"
              leftIcon={<MessageCircle className="w-4 h-4" />}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
