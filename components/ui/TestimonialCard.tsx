'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  rating: number;
  variant?: 'white' | 'gray';
}

export function TestimonialCard({ name, role, quote, rating, variant = 'white' }: TestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 130;
  const isLong = quote.length > characterLimit;

  const displayText = isLong && !isExpanded 
    ? `${quote.substring(0, characterLimit)}...` 
    : quote;

  const cardClasses = variant === 'white'
    ? 'bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(11,31,58,0.04)]'
    : 'bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm';

  return (
    <div className={`h-full flex flex-col hover:-translate-y-1 transition-transform duration-300 relative ${cardClasses}`}>
      {variant === 'gray' && (
        <div className="absolute top-6 right-8 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[#0B1F3A] text-6xl">format_quote</span>
        </div>
      )}

      {/* Star Ratings */}
      <div className="flex text-[#E89B10] mb-6 gap-0.5">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        ))}
      </div>

      {/* Review Quote Text */}
      <div className="mb-8 flex-grow">
        <p className="text-gray-600 leading-relaxed italic inline">
          "{displayText}"
        </p>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#E89B10] hover:text-[#0B1F3A] text-xs font-bold ml-1.5 hover:underline transition-colors focus:outline-none inline-block whitespace-nowrap"
          >
            {isExpanded ? 'See Less' : 'See More...'}
          </button>
        )}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
        <div className="w-12 h-12 bg-[#0B1F3A]/5 rounded-full flex items-center justify-center font-bold text-[#0B1F3A] font-headline shrink-0 uppercase">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-sm text-[#0B1F3A]">{name}</h4>
          <p className="text-xs text-gray-400 font-semibold">{role}</p>
        </div>
      </div>
    </div>
  );
}
