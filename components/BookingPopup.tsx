'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { whatsappLink } from '@/lib/constants';
import { useSettings } from '@/components/SettingsProvider';

export default function BookingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('skydeepPopupSeen');
    if (hasSeenPopup) return;

    const handleScroll = () => {
      if (triggeredRef.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

      if (scrollPercentage > 40) {
        triggeredRef.current = true;
        setIsOpen(true);
        sessionStorage.setItem('skydeepPopupSeen', 'true');
        window.removeEventListener('scroll', handleScroll);

        timerRef.current = setTimeout(() => {
          setIsOpen(false);
        }, 25000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-4">
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[850px] max-h-[88dvh] md:max-h-[92vh] bg-white rounded-2xl md:rounded-[24px] shadow-2xl z-10 flex flex-col border border-gray-100 overflow-hidden"
          >

            {/* Close Button — Always on top */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-black/30 md:bg-gray-100 hover:bg-black/50 md:hover:bg-gray-200 text-white md:text-gray-500 md:hover:text-gray-900 transition-colors flex items-center justify-center shadow-lg md:shadow-sm backdrop-blur-sm"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Scrollable content wrapper */}
            <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto overscroll-contain">

              {/* LEFT SIDE PANEL (Dark / Scorpio Image Background) */}
              <div className="relative w-full md:w-[42%] bg-[#050B14] overflow-hidden flex flex-col justify-end p-5 md:p-8 shrink-0 min-h-[180px] md:min-h-auto z-0">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/images/scorpio_n_popup.png"
                    alt="Scorpio N Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 md:bg-gradient-to-r md:from-transparent md:to-slate-950/40" />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" />
                </div>

                {/* Slanted Divider - Desktop only */}
                <div 
                  className="hidden md:block absolute top-0 bottom-0 right-0 w-16 bg-white z-10"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                />

                {/* Badge */}
                <div className="relative z-20 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold text-white tracking-wide self-start shadow-sm select-none mb-3 md:mb-0 md:absolute md:top-8 md:left-8">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Available Now
                </div>

                {/* Text Stack */}
                <div className="relative z-20 space-y-2 md:space-y-3 md:my-auto">
                  <h3 className="text-2xl md:text-4xl lg:text-[40px] font-black text-white font-headline leading-[1.1] tracking-tight uppercase">
                    Need Help <br />Booking Your <br />
                    <span className="bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">Car?</span>
                  </h3>
                  <p className="text-white/70 text-[11px] md:text-sm leading-relaxed max-w-[280px]">
                    Talk to our booking expert & get instant car availability in {settings.city || 'Ujjain'}.
                  </p>
                </div>

                {/* Trust Badge — hidden on mobile to save space */}
                <div className="hidden md:flex relative z-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 items-center gap-3 mt-8 max-w-[240px]">
                  <div className="w-9 h-9 rounded-xl bg-[#E89B10]/20 flex items-center justify-center text-[#E89B10] shrink-0">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-sm font-black leading-none">Trusted by 1500+</p>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1">Happy Customers</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE PANEL (White / CTAs) */}
              <div className="relative flex-grow p-5 md:p-8 flex flex-col z-10 md:w-[58%] bg-white md:overflow-y-auto">
                <div className="space-y-4 md:space-y-5">
                  {/* Header Title */}
                  <div>
                    <h3 className="text-lg md:text-2xl font-black text-[#0B1F3A] tracking-tight uppercase">
                      Connect With Us
                    </h3>
                    <p className="text-gray-400 text-[11px] md:text-xs font-semibold tracking-wide mt-0.5 leading-none">
                      We are available 24/7 to assist you
                    </p>
                    <div className="w-10 md:w-12 h-1 bg-[#E89B10] rounded-full mt-2 md:mt-3" />
                  </div>

                  {/* Call Button */}
                  <a
                    href={`tel:${settings.phone}`}
                    className="group flex items-center gap-3 md:gap-4 bg-gradient-to-r from-[#16a34a] to-[#15803d] hover:from-[#15803d] hover:to-[#166534] text-white rounded-xl md:rounded-2xl p-3 md:p-4 transition-all shadow-md hover:shadow-lg w-full text-left"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center text-[#15803d] shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                      <span className="material-symbols-outlined text-xl md:text-2xl font-black animate-pulse">call</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-white/80 text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider">Call Now</span>
                      <span className="text-white text-lg md:text-2xl font-black tracking-tight">{settings.phoneDisplay || settings.phone}</span>
                    </div>
                  </a>

                  {/* OR Divider */}
                  <div className="relative flex items-center py-0">
                    <div className="flex-grow border-t border-gray-150"></div>
                    <span className="flex-shrink-0 mx-3 text-gray-400 text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-gray-150"></div>
                  </div>

                  {/* WhatsApp Button */}
                  <a
                    href={whatsappLink(`Hi ${settings.name}! I need help booking a self-drive car in ${settings.city}.`, settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border-2 border-green-500 text-[#15803d] bg-white hover:bg-green-500/5 rounded-xl md:rounded-2xl py-3 font-bold transition-all shadow-sm text-sm group"
                  >
                    <svg className="w-5 h-5 text-green-500 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Book on WhatsApp
                  </a>

                  {/* Why Choose Us — compact on mobile */}
                  <div className="bg-[#F4F7FC]/80 border border-[#E4ECF8] rounded-xl md:rounded-2xl p-3 md:p-5 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-24 h-24 text-gray-200/35 pointer-events-none z-0">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.25" viewBox="0 0 100 100">
                        <path d="M 30,50 A 20,20 0 0,1 70,50" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="13" fill="none" />
                        <path d="M 42,48 L 58,48" strokeLinecap="round" />
                        <rect x="27" y="44" width="6" height="12" rx="2" fill="currentColor" />
                        <rect x="67" y="44" width="6" height="12" rx="2" fill="currentColor" />
                        <path d="M 67,52 L 60,62 L 54,62" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 32,78 C 32,70 38,64 50,64 C 62,64 68,70 68,78" />
                      </svg>
                    </div>
                    
                    <h4 className="text-[#0B1F3A]/90 font-extrabold text-[9px] md:text-[10px] uppercase tracking-widest mb-3 md:mb-4 z-10 relative">
                      Why Choose {settings.name || 'DriveKro.IN'}?
                    </h4>

                    <div className="grid grid-cols-2 gap-2.5 md:gap-4 relative z-10">
                      {[
                        { icon: 'bolt', label: 'Instant Booking', sub: 'Get instant availability', color: 'bg-[#E89B10]/15 text-[#E89B10]' },
                        { icon: 'security', label: 'Low Deposit', sub: 'No hidden charges', color: 'bg-blue-500/10 text-blue-600' },
                        { icon: 'support_agent', label: '24/7 Support', sub: "We're here anytime", color: 'bg-purple-500/10 text-purple-600' },
                        { icon: 'verified', label: 'Verified Cars', sub: 'Well maintained', color: 'bg-emerald-500/10 text-emerald-600' },
                      ].map((item) => (
                        <div key={item.icon} className="flex items-center gap-2 md:gap-3">
                          <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined text-[14px] md:text-[18px] font-bold">{item.icon}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] md:text-xs font-bold text-[#0B1F3A] truncate">{item.label}</span>
                            <span className="text-[8px] md:text-[9px] text-gray-400 font-semibold leading-none mt-0.5">{item.sub}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cars Starting From */}
                  <div className="bg-[#F4F7FC]/80 border border-[#E4ECF8] p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-between relative overflow-hidden">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-[8px] md:text-[9px] font-extrabold tracking-wider uppercase">Cars Starting From</span>
                      <span className="text-[#0B1F3A] font-black text-xl md:text-3xl font-headline mt-0.5 flex items-baseline">
                        ₹1,200 <span className="text-[10px] md:text-xs font-bold text-gray-400 ml-1">/ 12 hrs</span>
                      </span>
                    </div>
                    <div className="w-24 md:w-28 h-10 md:h-12 relative select-none">
                      <img 
                        src="/images/white_car_starting.png" 
                        alt="Starting Car"
                        className="absolute right-0 bottom-[-4px] md:bottom-[-6px] h-14 md:h-16 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
