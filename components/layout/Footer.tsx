import Link from 'next/link';
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000615] w-full pt-20 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1152d4] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[120px] opacity-5 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6 lg:pr-8">
            <Link href="/" className="inline-block">
               <span className="text-2xl font-black text-white tracking-widest uppercase font-headline">Skydeep<span className="text-[#E89B10]">group</span></span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Indore's leading self-[drive] car rental provider since 2019. We believe in providing mobility with absolute freedom, premium quality, and zero hidden costs.
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
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase uppercase">Company</h4>
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
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase uppercase">Explore & Support</h4>
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
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase uppercase">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-[#E89B10] shrink-0 text-[20px]">pin_drop</span>
                <span className="text-white/60 text-sm leading-relaxed">{BUSINESS.address}</span>
              </li>
              <li className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-[#E89B10] shrink-0 text-[20px]">call</span>
                <a href={`tel:${BUSINESS.phone}`} className="text-white/60 hover:text-white text-sm transition-colors">{BUSINESS.phoneDisplay}</a>
              </li>
              <li className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-[#25D366] shrink-0 text-[20px]">chat</span>
                <a href={whatsappLink(WHATSAPP_MESSAGES.footer)} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#25D366] text-sm transition-colors">WhatsApp Us</a>
              </li>
              <li className="flex gap-4 mt-6">
                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white font-bold text-sm mb-1 text-center">Business Hours</p>
                  <p className="text-[#E89B10] text-xs text-center font-medium">{BUSINESS.hours}</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs font-medium">
            © {currentYear} {BUSINESS.name}. All rights reserved. Self Drive Car Rental Indore.
          </p>
          <div className="flex gap-6">
             <Link href="/terms" className="text-white/40 hover:text-white text-xs font-medium transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="text-white/40 hover:text-white text-xs font-medium transition-colors">Rental Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
