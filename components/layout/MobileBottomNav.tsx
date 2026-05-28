'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/components/SettingsProvider';
import { BUSINESS } from '@/lib/constants';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { settings } = useSettings();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const whatsappNumber = settings.whatsapp || BUSINESS.whatsapp;
  const whatsappMsg = settings.whatsappDefaultMsg || 'Hi! I want to book a self drive car.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: 'home',
    },
    {
      href: '/cars',
      label: 'Cars',
      icon: 'directions_car',
    },
    {
      href: '/pricing',
      label: 'Pricing',
      icon: 'payments',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-8px_30px_rgba(11,31,58,0.08)] md:hidden grid grid-cols-4 items-center justify-items-center py-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 text-center transition-all duration-200 active:scale-95 group w-full"
          >
            <span
              className={`material-symbols-outlined text-2xl transition-colors duration-200 ${
                active ? 'text-[#E89B10]' : 'text-[#0B1F3A]/70 group-hover:text-[#0B1F3A]'
              }`}
              style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span
              className={`text-[11px] font-bold tracking-wide transition-colors duration-200 ${
                active ? 'text-[#E89B10]' : 'text-[#0B1F3A]/60 group-hover:text-[#0B1F3A]'
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Book Now (WhatsApp) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 text-center text-[#25D366] transition-all duration-200 active:scale-95 group w-full"
      >
        <div className="w-6 h-6 flex items-center justify-center relative">
          <svg className="w-5.5 h-5.5 text-[#25D366] fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full"></span>
        </div>
        <span className="text-[11px] font-extrabold tracking-wide">Book Now</span>
      </a>
    </div>
  );
}
