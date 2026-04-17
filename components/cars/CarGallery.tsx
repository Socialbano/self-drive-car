'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { CarImage } from '@/types';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { clsx } from 'clsx';

interface CarGalleryProps {
  primaryImage: string;
  images: CarImage[];
  carName: string;
}

export function CarGallery({ primaryImage, images, carName }: CarGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Construct full image array with primary image first
  const allImages = [
    { id: 'primary', url: primaryImage },
    ...images.map(img => ({ id: img.id, url: img.url }))
  ];

  if (allImages.length === 1) {
    return (
      <div className="relative aspect-[16/10] w-full bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <Image
          src={getCloudinaryUrl(allImages[0].url, { width: 1200, crop: 'scale' })}
          alt={carName}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Slider */}
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4 border border-gray-100 bg-gray-50"
      >
        {allImages.map((image, index) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full">
              <Image
                src={getCloudinaryUrl(image.url, { width: 1200, crop: 'scale' })}
                alt={`${carName} - View ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={12}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full h-20 sm:h-24 gallery-thumbs cursor-pointer"
      >
        {allImages.map((image, idx) => (
          <SwiperSlide key={`thumb-${image.id}`} className={clsx(
            "rounded-lg overflow-hidden border-2 border-transparent transition-all",
            "opacity-60 [&.swiper-slide-thumb-active]:border-accent [&.swiper-slide-thumb-active]:opacity-100"
          )}>
            <div className="relative w-full h-full">
              <Image
                src={getCloudinaryUrl(image.url, { width: 300, height: 200, crop: 'fill' })}
                alt={`${carName} Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
