'use client';

import Link from 'next/link';
import { whatsappLink as staticWhatsappLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import { useSettings } from '@/components/SettingsProvider';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  // Dynamic whatsapp Link helper
  const whatsappLink = (message: string) => {
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  // Split logo name dynamically
  let firstName = 'Car';
  let lastName = 'Rental';
  const trimmedName = settings.name.trim();
  if (trimmedName) {
    const nameParts = trimmedName.split(/\s+/);
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }

  return (
    <footer className="bg-[#000615] w-full pt-20 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1152d4] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[120px] opacity-5 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6 lg:pr-8">
            <Link href="/" className="flex items-center gap-3">
              {settings.logoUrl ? (
                <div className="w-[36px] h-[36px] relative flex items-center justify-center overflow-hidden shrink-0">
                  <img 
                    src={settings.logoUrl} 
                    alt={`${settings.name} logo`} 
                    className="w-full h-full object-contain rounded-[10px]"
                  />
                </div>
              ) : null}
              <span className="text-2xl font-black text-white tracking-widest uppercase font-headline">
                {firstName}<span className="text-[#E89B10]">{lastName}</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              {settings.city}'s leading self-drive car rental provider since 2019. We believe in providing mobility with absolute freedom, premium quality, and zero hidden costs.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#1152d4] hover:border-transparent transition-all">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#1152d4] hover:border-transparent transition-all">
                <span className="material-symbols-outlined text-[20px]">thumb_up</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#1152d4] hover:border-transparent transition-all">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> About Us</Link></li>
              <li><Link href="/cars" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> Our Fleet</Link></li>
              <li><Link href="/pricing" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> Pricing</Link></li>
              <li><Link href="/blog" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> Travel Blog</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> Contact Us</Link></li>
            </ul>
          </div>

          {/* Locations & Support */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase">Explore & Support</h4>
            <ul className="space-y-4">
              <li><Link href="/locations/goa" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> Goa Location</Link></li>
              <li><Link href="/locations/jaipur" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> Jaipur Location</Link></li>
              <li><Link href="/locations/ashok-nagar" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> Ashok Nagar</Link></li>
              <li><Link href="/faq" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> FAQs</Link></li>
              <li><Link href="/terms" className="text-white/60 hover:text-[#E89B10] text-sm transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[#E89B10]/0 group-hover:bg-[#E89B10] transition-colors"></span> Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-[#E89B10] shrink-0 text-[20px]">pin_drop</span>
                <span className="text-white/60 text-sm leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-[#E89B10] shrink-0 text-[20px]">call</span>
                <a href={`tel:${settings.phone}`} className="text-white/60 hover:text-white text-sm transition-colors">{settings.phoneDisplay}</a>
              </li>
              <li className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-[#25D366] shrink-0 text-[20px]">chat</span>
                <a href={whatsappLink(WHATSAPP_MESSAGES.footer)} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#25D366] text-sm transition-colors">WhatsApp Us</a>
              </li>
              <li className="flex gap-4 mt-6">
                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white font-bold text-sm mb-1 text-center">Business Hours</p>
                  <p className="text-[#E89B10] text-xs text-center font-medium">{settings.hours}</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-white/40 text-xs font-medium">
              © {currentYear} {settings.name}. All rights reserved. {settings.heroTitleP1} {settings.heroTitleP2}.
            </p>
            <p className="text-white/30 text-[10px] font-medium">
              Developed by <a href="https://socialbano.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#E89B10] transition-colors">Social Bano Technologies Pvt. Ltd.</a>
            </p>
          </div>
          <div className="flex gap-6">
             <Link href="/terms" className="text-white/40 hover:text-white text-xs font-medium transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="text-white/40 hover:text-white text-xs font-medium transition-colors">Rental Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
