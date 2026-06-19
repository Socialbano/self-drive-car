'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSettings } from '@/components/SettingsProvider';
import { insertLead } from '@/lib/supabase/queries';
import { WHATSAPP_MESSAGES } from '@/lib/constants';
import toast from 'react-hot-toast';

const TIME_OPTIONS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-xl md:text-2xl font-black text-white leading-none tabular-nums">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function HeroSection() {
  const { settings, locations } = useSettings();

  // Booking Form State
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [carType, setCarType] = useState('All Car Types');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const heroBg = settings.heroImageUrl;

  const whatsappLink = (message: string) => {
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupLocation || !pickupDate || !pickupTime || !returnDate || !returnTime || !whatsappNumber) {
      toast.error('Please fill in all the required fields.');
      return;
    }

    setSubmitting(true);

    // Construct inquiry details message for Supabase Lead record
    const leadMessage = `Hero Booking Form Inquiry:
- Pickup: ${pickupLocation}
- Pickup DateTime: ${pickupDate} @ ${pickupTime}
- Return DateTime: ${returnDate} @ ${returnTime}
- Car Category Interest: ${carType}
- Client Mobile: ${whatsappNumber}`;

    // 1. Submit lead details dynamically to the Supabase database
    const { success, error } = await insertLead({
      name: 'Hero Booking Inquiry',
      phone: whatsappNumber,
      car_type: carType !== 'All Car Types' ? carType : 'General Inquiry',
      pickup_date: pickupDate,
      message: leadMessage,
    });

    setSubmitting(false);

    // 2. Format a gorgeous pre-filled WhatsApp message for booking availability request
    const waText = `Hi! I want to check availability for a self-drive car rental.
Here are my booking requirements:
📍 Pickup: ${pickupLocation}
📅 Start: ${pickupDate} (${pickupTime})
📅 End: ${returnDate} (${returnTime})
🚗 Selected Car: ${carType}
📱 Contact: ${whatsappNumber}

Please confirm availability. Thanks!`;

    const customWhatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waText)}`;

    if (success) {
      toast.success('Inquiry saved to dashboard! Redirecting to WhatsApp...');
      // Reset Form
      setPickupLocation('');
      setPickupDate('');
      setPickupTime('');
      setReturnDate('');
      setReturnTime('');
      setCarType('All Car Types');
      setWhatsappNumber('');
      
      // Redirect User to WhatsApp
      setTimeout(() => {
        window.open(customWhatsappUrl, '_blank');
      }, 800);
    } else {
      console.error('Error saving lead:', error);
      toast.error('Something went wrong. Redirecting directly to WhatsApp...');
      window.open(customWhatsappUrl, '_blank');
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#000615]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Luxury Car Fleet Background"
          className="w-full h-full object-cover scale-105"
          src={heroBg}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000615] via-transparent to-transparent" />
      </div>

      {/* Main Grid Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Features */}
          <div className="lg:col-span-7 space-y-8">
            {/* Tagline / serving areas badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-white/90 text-xs font-bold tracking-wider uppercase">
                {settings.heroTagline}
              </span>
            </div>

            {/* Dynamic Headers */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white font-headline leading-[1.1] tracking-tight">
              {settings.heroTitleP1} <br />
              <span className="bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">
                {settings.heroTitleP2}
              </span>
            </h1>

            {/* Hero Description */}
            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl">
              {settings.heroDescription}
            </p>

            {/* Feature Badges list */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E89B10] shrink-0">
                  <span className="material-symbols-outlined text-xl">shield</span>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Zero Deposit</h4>
                  <p className="text-white/40 text-[10.5px] font-medium leading-none mt-0.5">No hidden charges</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E89B10] shrink-0">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Instant Booking</h4>
                  <p className="text-white/40 text-[10.5px] font-medium leading-none mt-0.5">On WhatsApp</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E89B10] shrink-0">
                  <span className="material-symbols-outlined text-xl">directions_car</span>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Well Maintained</h4>
                  <p className="text-white/40 text-[10.5px] font-medium leading-none mt-0.5">Sanitized Cars</p>
                </div>
              </div>
            </div>

            {/* Left CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={whatsappLink(WHATSAPP_MESSAGES.hero)}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-[#20BD5A] transition-all duration-300 shadow-xl shadow-[#25D366]/20 active:scale-95 text-sm md:text-base"
              >
                <span className="material-symbols-outlined text-xl font-bold">chat</span>
                Book on WhatsApp
              </a>
              <Link
                href="/cars"
                className="px-8 py-4 border-2 border-white/20 text-white rounded-2xl font-bold hover:bg-white/10 hover:border-white transition-all duration-300 active:scale-95 text-sm md:text-base flex items-center gap-2"
              >
                Explore Fleet
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Translucent Stats Card Row */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E89B10]/20 flex items-center justify-center text-[#E89B10] shrink-0">
                  <span className="material-symbols-outlined text-lg">groups</span>
                </div>
                <div>
                  <AnimatedCounter target={settings.heroStat1Value} suffix="+" />
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">{settings.heroStat1Label}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10 shrink-0" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E89B10]/20 flex items-center justify-center text-[#E89B10] shrink-0">
                  <span className="material-symbols-outlined text-lg">directions_car</span>
                </div>
                <div>
                  <AnimatedCounter target={settings.heroStat2Value} suffix="+" />
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">{settings.heroStat2Label}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10 shrink-0" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E89B10]/20 flex items-center justify-center text-[#E89B10] shrink-0">
                  <span className="material-symbols-outlined text-lg">headset_mic</span>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-white leading-none">24/7</div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">Customer Support</p>
                </div>
              </div>
            </div>

            {/* Google Rating */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/95 text-sm">
              <span className="text-lg font-black text-red-500 bg-white rounded-md w-5 h-5 flex items-center justify-center leading-none text-[12px] font-sans shadow-sm select-none">G</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white leading-none">4.9</span>
                  <div className="flex text-[#E89B10] text-[10px] tracking-widest leading-none">
                    ★★★★★
                  </div>
                </div>
                <p className="text-white/40 text-[10.5px] font-medium leading-none mt-1">Rated by 500+ customers on Google</p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Booking Availability Form */}
          <div className="lg:col-span-5">
            <div className="bg-[#0B1F3A]/45 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
              <div className="text-center">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  Book Your Car
                </h3>
                <p className="text-[#E89B10] text-xs font-bold uppercase tracking-widest mt-1.5 flex items-center justify-center gap-1.5">
                  <span>Quick</span>
                  <span className="text-white/20">•</span>
                  <span>Easy</span>
                  <span className="text-white/20">•</span>
                  <span>Secure</span>
                </p>
              </div>

              {/* Form container */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Pickup Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block">Pickup Location</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 text-lg pointer-events-none">location_on</span>
                    <select
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-12 pr-10 py-3 text-white text-sm font-semibold focus:ring-2 focus:ring-[#E89B10] outline-none cursor-pointer appearance-none"
                    >
                      <option value="" disabled className="bg-slate-950 text-white">Select pickup location</option>
                      {locations.filter(loc => loc.is_active).map((loc) => (
                        <option key={loc.id} value={loc.name} className="bg-slate-950 text-white">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 text-slate-400 text-lg pointer-events-none">expand_more</span>
                  </div>
                </div>

                {/* Pickup Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block">Pickup Date</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-slate-400 text-base pointer-events-none">calendar_today</span>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-2 py-3 text-white text-xs font-semibold focus:ring-2 focus:ring-[#E89B10] outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block">Pickup Time</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-slate-400 text-base pointer-events-none">schedule</span>
                      <select
                        required
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-8 py-3 text-white text-xs font-semibold focus:ring-2 focus:ring-[#E89B10] outline-none cursor-pointer appearance-none"
                      >
                        <option value="" disabled className="bg-slate-950 text-white">Select time</option>
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time} className="bg-slate-950 text-white">{time}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 text-slate-400 text-base pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Return Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block">Return Date</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-slate-400 text-base pointer-events-none">calendar_today</span>
                      <input
                        type="date"
                        required
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-2 py-3 text-white text-xs font-semibold focus:ring-2 focus:ring-[#E89B10] outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block">Return Time</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-slate-400 text-base pointer-events-none">schedule</span>
                      <select
                        required
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-8 py-3 text-white text-xs font-semibold focus:ring-2 focus:ring-[#E89B10] outline-none cursor-pointer appearance-none"
                      >
                        <option value="" disabled className="bg-slate-950 text-white">Select time</option>
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time} className="bg-slate-950 text-white">{time}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 text-slate-400 text-base pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Select Car Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block">Select Car Type</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 text-lg pointer-events-none">directions_car</span>
                    <select
                      required
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-12 pr-10 py-3 text-white text-sm font-semibold focus:ring-2 focus:ring-[#E89B10] outline-none cursor-pointer appearance-none"
                    >
                      <option value="All Car Types" className="bg-slate-950 text-white">All Car Types</option>
                      <option value="Hatchback" className="bg-slate-950 text-white">Hatchback</option>
                      <option value="Sedan" className="bg-slate-950 text-white">Sedan</option>
                      <option value="SUV" className="bg-slate-950 text-white">SUV</option>
                      <option value="Luxury" className="bg-slate-950 text-white">Luxury</option>
                      <option value="Electric" className="bg-slate-950 text-white">Electric</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 text-slate-400 text-lg pointer-events-none">expand_more</span>
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block">WhatsApp Number</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 text-lg pointer-events-none">chat</span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="Enter WhatsApp number"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm font-semibold focus:ring-2 focus:ring-[#E89B10] outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#E89B10] hover:bg-[#d48c0b] text-[#0B1F3A] font-black py-3.5 rounded-xl shadow-lg shadow-[#E89B10]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0B1F3A]/30 border-t-[#0B1F3A] rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base font-black">directions_car</span>
                      Check Availability
                    </>
                  )}
                </button>
              </form>

              {/* Checkmarks under button */}
              <div className="flex justify-between items-center text-white/70 text-[10.5px] font-bold pt-2 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#E89B10] text-sm">check_circle</span>
                  Zero Deposit
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#E89B10] text-sm">check_circle</span>
                  Instant Confirm
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#E89B10] text-sm">check_circle</span>
                  Sanitized Cars
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
