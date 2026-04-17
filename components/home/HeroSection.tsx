'use client';

import Link from 'next/link';
import { BUSINESS, whatsappLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import { useEffect, useRef, useState } from 'react';

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
    <div ref={ref} className="text-4xl md:text-5xl font-black text-white tabular-nums">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function HeroSection() {
  const [heroBg, setHeroBg] = useState<string>("https://lh3.googleusercontent.com/aida-public/AB6AXuC_TdM_ImPwMCMM2dYlQk6EyDq0xxvq77Xn8kYNsIvRucFG6jemS1JzrM8LjdcN2S967DWrk1whhNKKHYzWHuaJdjoZJqzdg1p8f9aqhX0xfpAjA3LFcDOsm1sdUYiJfU9BkJmrBzcZ_KW2AcMSzaHXdyfgL2Iop1fbJtGo3a9kSJroBay9q5yuSQ10aHZAzW_MzUeCA2A1I1LyRd2ZYoyfMhVtkKJlUfWkGlarcb3a7GAQzT2X8WPe48a7z6Xl7Txa7m-7xtwss6k");

  useEffect(() => {
    fetch('/api/hero-settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.heroImage) {
          setHeroBg(data.heroImage);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[90vh] w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-[#000615]">
        <img
          alt="Luxury Car Fleet in Indore"
          className="w-full h-full object-cover scale-105 transition-opacity duration-700 ease-in-out"
          src={heroBg}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000615] via-[#000615]/85 to-[#000615]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000615]/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-8 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-white/80 text-xs font-semibold tracking-wider uppercase">
              Now Serving Indore, Goa & Jaipur
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white font-headline leading-[1.1] mb-6 tracking-tight">
            Self Drive Car{' '}
            <br />
            <span className="gradient-text">Rental in Indore</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed max-w-lg">
            Premium self-drive car rental service with zero security deposit.
            Experience the freedom of the road with our fleet of luxury SUVs and sedans.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.hero)}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-[#20BD5A] transition-all duration-300 shadow-xl shadow-[#25D366]/20 active:scale-95"
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                chat
              </span>
              Book on WhatsApp
            </a>
            <Link
              href="/cars"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-bold hover:bg-white hover:text-[#0B1F3A] transition-all duration-300 active:scale-95"
            >
              View Fleet
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex gap-12">
            <div>
              <AnimatedCounter target={1500} suffix="+" />
              <p className="text-white/40 text-sm font-medium mt-1">Happy Customers</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <AnimatedCounter target={100} suffix="+" />
              <p className="text-white/40 text-sm font-medium mt-1">Cars in Fleet</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
