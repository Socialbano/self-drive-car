'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { useSettings } from '@/components/SettingsProvider';
import type { Testimonial as DBTestimonial } from '@/types';

interface TestimonialsProps {
  initialTestimonials?: DBTestimonial[];
}

import { TestimonialCard } from '@/components/ui/TestimonialCard';

export function Testimonials({ initialTestimonials }: TestimonialsProps) {
  const { settings } = useSettings();
  
  const staticTestimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Business Owner',
      quote: "Best experience renting a Thar for my weekend trip to Mandu. The car was spotless and the process was super smooth. Highly recommended!",
      rating: 5,
    },
    {
      name: 'Ananya Jain',
      role: 'Tech Lead',
      quote: `No security deposit is a game changer. ${settings.name} makes it so easy to get a car whenever you need one. Professional service.`,
      rating: 5,
    },
    {
      name: 'Vivek Gupta',
      role: 'Photography Enthusiast',
      quote: "Very prompt response and clean cars. Used their Fortuner for a family event and it was perfect. Will definitely rent again.",
      rating: 5,
    },
    {
      name: 'Priya Mishra',
      role: 'Frequent Traveler',
      quote: `Transformed my regular ${settings.city} trips. The cars are always in pristine condition. Their 24/7 support is actually 24/7.`,
      rating: 5,
    }
  ];

  const testimonials = initialTestimonials && initialTestimonials.length > 0
    ? initialTestimonials.map(t => ({
        name: t.customer_name,
        role: t.car_rented ? `${t.car_rented} (${t.city})` : t.city || 'Verified Customer',
        quote: t.review_text,
        rating: t.rating || 5,
      }))
    : staticTestimonials;


  return (
    <section className="section-padding bg-[#f9f9f9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2 tracking-tight">
            Loved by {settings.city}'s Travelers
          </h2>
        </div>

        <div className="relative">
          {/* Decorative quote marks */}
          <span className="absolute -top-10 -left-6 text-9xl text-[var(--color-primary)]/5 font-serif leading-none z-0">
            "
          </span>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, bulletClass: 'swiper-custom-bullet', bulletActiveClass: 'swiper-custom-bullet-active' }}
            className="pb-16 !z-10"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i} className="h-auto">
                <TestimonialCard
                  name={t.name}
                  role={t.role}
                  quote={t.quote}
                  rating={t.rating}
                  variant="white"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <style jsx global>{`
            .swiper-custom-bullet {
              width: 8px;
              height: 8px;
              display: inline-block;
              border-radius: 50%;
              background: #cbd5e1;
              opacity: 0.5;
              margin: 0 4px;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .swiper-custom-bullet-active {
              opacity: 1;
              background: #0B1F3A;
              width: 24px;
              border-radius: 4px;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
