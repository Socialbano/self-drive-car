'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { MarqueeMessage } from '@/types';

export function MarqueeBar() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<MarqueeMessage[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('marquee_messages')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: true });

        if (!error && data) setMessages(data as MarqueeMessage[]);
      } catch {
        // Silently fail — marquee is non-critical
      }
    };

    fetchMessages();

    // Auto-refresh every 60 seconds for near-realtime updates
    const interval = setInterval(fetchMessages, 60000);
    return () => clearInterval(interval);
  }, []);

  if (pathname?.startsWith('/admin') || dismissed || messages.length === 0) return null;

  const marqueeText = messages.map((m) => `${m.icon} ${m.text}`).join('   •   ');
  // Duplicate for seamless infinite loop
  const fullText = `${marqueeText}   •   ${marqueeText}   •   ${marqueeText}`;

  return (
    <div className="relative w-full bg-gradient-to-r from-[#0B1F3A] via-[#122a4a] to-[#0B1F3A] overflow-hidden z-[60]">
      {/* Shimmer edge effects */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0B1F3A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-8 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0B1F3A] to-transparent z-10 pointer-events-none" />

      <div
        className="flex items-center h-[36px] md:h-[40px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={scrollRef}
          className="whitespace-nowrap"
          style={{
            animation: `marquee-scroll ${messages.length * 12}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          <span className="text-[11px] md:text-xs font-semibold tracking-wide text-white/90 px-4">
            {fullText}
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close announcement bar"
      >
        <span className="material-symbols-outlined text-white/70 text-[14px]">close</span>
      </button>

      {/* Keyframes injected inline */}
      <style jsx>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
