'use client';

import { useState } from 'react';
import { useSettings } from '@/components/SettingsProvider';

export function WhyChooseUs() {
  const { settings } = useSettings();
  const [activeIdx, setActiveIdx] = useState(0);

  const features = [
    {
      icon: 'account_balance_wallet',
      title: 'No Security Deposit',
      description: 'Book your car without any heavy upfront security payments. Trust is our foundation.',
      gradient: 'from-[#E89B10]/10 to-[#FFD700]/5',
    },
    {
      icon: 'verified_user',
      title: 'Fully Insured Fleet',
      description: 'All our cars come with comprehensive insurance, ensuring your safety and peace of mind.',
      gradient: 'from-[#1152d4]/10 to-[#5b9cff]/5',
    },
    {
      icon: 'all_inclusive',
      title: 'Unlimited KMs',
      description: "Don't count the miles. Drive as much as you want on select premium packages.",
      gradient: 'from-[#25D366]/10 to-[#66ff8e]/5',
    },
    {
      icon: 'support_agent',
      title: '24/7 Roadside Support',
      description: 'Stuck somewhere? Our dedicated support team is just one call away, anytime.',
      gradient: 'from-[#ff6b6b]/10 to-[#ffa07a]/5',
    },
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild 
      ? (container.firstElementChild as HTMLElement).offsetWidth 
      : 280;
    const gap = 16; // gap-4 is 16px
    const index = Math.round(scrollLeft / (cardWidth + gap));
    if (index >= 0 && index < features.length) {
      setActiveIdx(index);
    }
  };

  return (
    <section className="section-padding bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2 tracking-tight">
            Why {settings.name} is {settings.city}'s Favorite
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            We provide a seamless and trustworthy car rental experience built around your convenience.
          </p>
        </div>

        {/* Mobile View: Horizontal Scrollable Carousel Cards (Compact & Smooth) */}
        <div className="md:hidden">
          <div 
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar pb-4 px-1"
          >
            {features.map((feature, i) => (
              <div
                key={i}
                className={`snap-center shrink-0 w-[85%] relative p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-gray-100/50 shadow-[0_8px_30px_rgba(11,31,58,0.03)] transition-all`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[#0B1F3A] text-xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0B1F3A] mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {features.map((_, idx) => (
              <span 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === idx ? 'w-4 bg-[#E89B10]' : 'w-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Feature Grid (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-gray-100/50 hover:shadow-[0_20px_50px_-12px_rgba(11,31,58,0.08)] transition-all duration-500 hover:-translate-y-1`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[#0B1F3A] text-2xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

