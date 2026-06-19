'use client';

import React from 'react';
import { useSettings } from '@/components/SettingsProvider';

export function SpecialOffers() {
  const { settings } = useSettings();

  const whatsappLink = (message: string) => {
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  const showOffer1 = settings.offer1Active;
  const showOffer2 = settings.offer2Active;

  // If both offers are disabled, do not render the section
  if (!showOffer1 && !showOffer2) {
    return null;
  }

  return (
    <section className="py-20 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] font-headline tracking-tight">
            {settings.offersSectionTitle}
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            {settings.offersSectionSubtitle}
          </p>
        </div>

        {/* Offers Grid */}
        <div className={`grid grid-cols-1 ${showOffer1 && showOffer2 ? 'md:grid-cols-2' : 'max-w-xl'} gap-8 mx-auto`}>
          {/* Card 1: Weekend Discount */}
          {showOffer1 && (
            <div className="relative p-8 md:p-10 rounded-[24px] bg-[#FFF8F2] border border-[#FEE2CD] shadow-sm flex flex-col justify-between overflow-hidden hover:scale-[1.01] transition-all duration-300">
              {/* Top right decorative shape */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#FEEAD9]/70 rounded-full translate-x-12 -translate-y-12 pointer-events-none"></div>

              <div className="relative z-10">
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#F97316] text-white flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">calendar_today</span>
                </div>

                {/* Title & Offer */}
                <h3 className="text-xl font-extrabold text-[#0B1F3A] mb-1 font-headline">{settings.offer1Title}</h3>
                <p className="text-4xl font-black text-[#F97316] mb-4 font-headline">{settings.offer1Discount}</p>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                  {settings.offer1Description}
                </p>
              </div>

              {/* Button */}
              <div className="mt-8 relative z-10">
                <a
                  href={whatsappLink(settings.offer1WhatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl active:scale-[0.98] transition-all duration-300 text-sm"
                >
                  {settings.offer1BtnText}
                </a>
              </div>
            </div>
          )}

          {/* Card 2: First Booking Offer */}
          {showOffer2 && (
            <div className="relative p-8 md:p-10 rounded-[24px] bg-[#F5F8FF] border border-[#D5E6FE] shadow-sm flex flex-col justify-between overflow-hidden hover:scale-[1.01] transition-all duration-300">
              {/* Top right decorative shape */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#E1EFFF]/70 rounded-full translate-x-12 -translate-y-12 pointer-events-none"></div>

              <div className="relative z-10">
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">redeem</span>
                </div>

                {/* Title & Offer */}
                <h3 className="text-xl font-extrabold text-[#0B1F3A] mb-1 font-headline">{settings.offer2Title}</h3>
                <p className="text-4xl font-black text-[#2563EB] mb-4 font-headline">{settings.offer2Discount}</p>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                  {settings.offer2Description}
                </p>
              </div>

              {/* Button */}
              <div className="mt-8 relative z-10">
                <a
                  href={whatsappLink(settings.offer2WhatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl active:scale-[0.98] transition-all duration-300 text-sm"
                >
                  {settings.offer2BtnText}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
