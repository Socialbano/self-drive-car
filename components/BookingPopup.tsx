'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { whatsappLink } from '@/lib/constants';

export default function BookingPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('skydeepPopupSeen');
    
    if (hasSeenPopup) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

      if (scrollPercentage > 40 && !isOpen) {
        setIsOpen(true);
        sessionStorage.setItem('skydeepPopupSeen', 'true');
        
        // Auto close after 15 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 15000);
        
        // Remove listener once triggered
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden glass z-10 border border-white/20"
            style={{ borderRadius: '16px' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Area */}
            <div className="bg-[#0B1F3A] text-white p-6 text-center md:text-left relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-xl md:text-2xl font-bold font-heading mb-2 flex items-center justify-center md:justify-start gap-2">
                <span className="text-2xl">🚗</span> Need Help Booking Your Car?
              </h3>
              <p className="text-[#E0E7FF] text-sm md:text-base font-body max-w-md">
                Talk to our booking expert & get instant car availability in Indore.
              </p>
            </div>

            {/* Body Area - Split Layout */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              
              {/* Left Section - CTA Focus */}
              <div className="flex-1 flex flex-col gap-4 border-r-0 md:border-r border-gray-100 md:pr-6">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold w-fit mb-1 border border-green-200 shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                  </span>
                  Available Now
                </div>
                
                <a 
                  href="tel:+919111330558"
                  className="group flex flex-col items-center justify-center bg-[#25D366] hover:bg-[#20BE5C] text-white rounded-xl p-4 transition-all hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
                >
                  <span className="font-bold text-lg flex items-center gap-2">
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Call Now
                  </span>
                  <span className="text-xl font-extrabold mt-1 tracking-tight group-hover:text-green-50">+91 9111330558</span>
                </a>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <a 
                  href={whatsappLink('Hi Skydeep! I saw the popup on your website and need help booking a car.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl py-3 font-bold transition-all hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Book on WhatsApp
                </a>
              </div>

              {/* Right Section - Value Proposition */}
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-gray-500 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Why SkydeepGroup?
                </h4>
                
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1152d4]/10 flex items-center justify-center text-[#1152d4]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="font-medium text-gray-700">Instant Booking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1152d4]/10 flex items-center justify-center text-[#1152d4]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <span className="font-medium text-gray-700">Low Security Deposit</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1152d4]/10 flex items-center justify-center text-[#1152d4]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <span className="font-medium text-gray-700">24/7 Support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1152d4]/10 flex items-center justify-center text-[#1152d4]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="font-medium text-gray-700">Verified Cars</span>
                  </li>
                </ul>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 text-center">
                  <p className="text-sm text-gray-500 font-medium">Cars starting from</p>
                  <p className="text-[#0B1F3A] font-extrabold text-xl font-heading mt-0.5">₹1,200 <span className="text-sm font-normal text-gray-500">/ 12 hrs</span></p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
