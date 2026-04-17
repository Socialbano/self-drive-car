'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import { LOCATION_GROUPS } from '@/lib/locations';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/cars', label: 'Cars' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [locDropdownOpen, setLocDropdownOpen] = useState(false);
  const [mobileLocOpen, setMobileLocOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setLocDropdownOpen(false);
    setMobileLocOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLocDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isLocationActive = pathname.startsWith('/locations');

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setLocDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setLocDropdownOpen(false), 200);
  };

  return (
    <>
      <nav
        className={`sticky top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(11,31,58,0.08)]'
            : 'bg-white/60 backdrop-blur-md'
        }`}
      >
        <div className="flex justify-between items-center px-6 lg:px-8 py-3.5 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="group flex flex-row items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Logo Icon */}
            <div className="w-[42px] h-[42px] rounded-[14px] bg-gradient-to-br from-[#0B1F3A] to-[#1a365d] flex items-center justify-center shadow-md shadow-[#0B1F3A]/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#0B1F3A]/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="text-white text-xl font-black tracking-wider relative z-10 drop-shadow-sm font-headline">
                S
              </span>
            </div>
            
            {/* Logo Text Stack */}
            <div className="flex flex-col leading-none pt-0.5 justify-center">
              <span className="text-[19px] md:text-[22px] font-black tracking-[0.02em] text-[#0f172a] font-headline mb-1 transition-colors duration-300">
                Sky Deep <span className="bg-gradient-to-br from-[#E89B10] to-[#c7820a] bg-clip-text text-transparent group-hover:from-[#0f172a] group-hover:to-[#0f172a] transition-all duration-300">Group</span>
              </span>
              <span className="text-[9px] md:text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.18em] transition-colors duration-300 group-hover:text-slate-500">
                Car Rental Services
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-[#0B1F3A] bg-[#0B1F3A]/5'
                    : 'text-[#0B1F3A]/70 hover:text-[#0B1F3A] hover:bg-[#0B1F3A]/5'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#E89B10] rounded-full" />
                )}
              </Link>
            ))}

            {/* Locations Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setLocDropdownOpen(!locDropdownOpen)}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  isLocationActive
                    ? 'text-[#0B1F3A] bg-[#0B1F3A]/5'
                    : 'text-[#0B1F3A]/70 hover:text-[#0B1F3A] hover:bg-[#0B1F3A]/5'
                }`}
              >
                Locations
                <span className={`material-symbols-outlined text-base transition-transform duration-300 ${locDropdownOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
                {isLocationActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#E89B10] rounded-full" />
                )}
              </button>

              {/* Dropdown Panel */}
              <div
                className={`absolute top-full right-0 mt-2 w-[340px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-12px_rgba(11,31,58,0.18)] border border-gray-100 overflow-hidden transition-all duration-300 origin-top ${
                  locDropdownOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="p-4">
                  {LOCATION_GROUPS.map((group, gi) => (
                    <div key={gi} className={gi > 0 ? 'mt-3 pt-3 border-t border-gray-100' : ''}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">
                        {group.label}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {group.items.map((loc) => {
                          const locPath = `/locations/${loc.slug}`;
                          const isCurrent = pathname === locPath || pathname === `${locPath}/`;
                          return (
                            <Link
                              key={loc.slug}
                              href={locPath}
                              prefetch={true}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                isCurrent
                                  ? 'bg-[#E89B10]/10 text-[#0B1F3A] font-bold'
                                  : 'text-[#0B1F3A]/70 hover:bg-[#0B1F3A]/5 hover:text-[#0B1F3A]'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                isCurrent ? 'bg-[#E89B10]' : 'bg-gray-300 group-hover:bg-[#E89B10]'
                              }`} />
                              {loc.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dropdown Footer */}
                <div className="bg-gray-50/80 px-4 py-3 border-t border-gray-100">
                  <Link
                    href="/cars"
                    className="flex items-center justify-center gap-2 text-xs font-bold text-[#0B1F3A] hover:text-[#E89B10] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">directions_car</span>
                    View All Cars
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center gap-2 text-sm font-semibold text-[#0B1F3A]/70 hover:text-[#0B1F3A] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              {BUSINESS.phoneDisplay}
            </a>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.hero)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0B1F3A] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0B1F3A]/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#0B1F3A]/20 active:scale-95"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#0B1F3A]/5 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span
                className={`h-0.5 bg-[#0B1F3A] rounded-full transition-all duration-300 ${
                  mobileOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`h-0.5 bg-[#0B1F3A] rounded-full transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-0.5 bg-[#0B1F3A] rounded-full transition-all duration-300 ${
                  mobileOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Slide-out */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-black text-[#0B1F3A] tracking-tighter">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[#0B1F3A]">close</span>
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'text-[#0B1F3A] bg-[#E89B10]/10 border-l-4 border-[#E89B10]'
                    : 'text-[#0B1F3A]/70 hover:text-[#0B1F3A] hover:bg-[#0B1F3A]/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Locations Accordion */}
            <button
              onClick={() => setMobileLocOpen(!mobileLocOpen)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                isLocationActive
                  ? 'text-[#0B1F3A] bg-[#E89B10]/10 border-l-4 border-[#E89B10]'
                  : 'text-[#0B1F3A]/70 hover:text-[#0B1F3A] hover:bg-[#0B1F3A]/5'
              }`}
            >
              Locations
              <span className={`material-symbols-outlined text-base transition-transform duration-300 ${mobileLocOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                mobileLocOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pl-4 pb-2 space-y-3 pt-1">
                {LOCATION_GROUPS.map((group, gi) => (
                  <div key={gi}>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-1.5">
                      {group.label}
                    </p>
                    {group.items.map((loc) => {
                      const locPath = `/locations/${loc.slug}`;
                      const isCurrent = pathname === locPath || pathname === `${locPath}/`;
                      return (
                        <Link
                          key={loc.slug}
                          href={locPath}
                          className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm transition-all ${
                            isCurrent
                              ? 'font-bold text-[#E89B10] bg-[#E89B10]/5'
                              : 'text-[#0B1F3A]/60 hover:text-[#0B1F3A]'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isCurrent ? 'bg-[#E89B10]' : 'bg-gray-300'
                          }`} />
                          {loc.name}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 space-y-3">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#0B1F3A]/10 text-sm font-bold text-[#0B1F3A] hover:bg-[#0B1F3A]/5 transition-all"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              Call {BUSINESS.phoneDisplay}
            </a>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.hero)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
