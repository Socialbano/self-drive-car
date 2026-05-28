'use client';

import Link from 'next/link';
import { useSettings } from '@/components/SettingsProvider';

export function CTABanner() {
  const { settings } = useSettings();
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1152d4] rounded-3xl p-8 md:p-16 text-center transform hover:scale-[1.01] transition-transform duration-500 shadow-2xl relative overflow-hidden">
          
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E89B10]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white font-headline mb-6 tracking-tight">
              Ready to hit the road?
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Book your ride today and experience the ultimate freedom of self-drive in {settings.city} with our premium, sanitized fleet.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/cars" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#0B1F3A] rounded-xl font-bold hover:bg-gray-50 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 active:scale-95"
              >
                Explore Fleet
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 active:scale-95"
              >
                Contact Support
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex justify-center gap-8 text-white/60 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E89B10]">local_taxi</span>
                Luxury SUVs: 4 Types
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E89B10]">directions_car</span>
                Premium Sedans: 8 Types
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
