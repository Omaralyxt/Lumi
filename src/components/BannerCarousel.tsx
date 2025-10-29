"use client";

import React, { useState, useEffect } from 'react';
import { getBanners } from '@/api/products';
import { Skeleton } from './ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  active: boolean;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBanners() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBanners();
        setBanners(data as Banner[]);
      } catch (e) {
        setError("Falha ao carregar banners.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadBanners();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-48 sm:h-64 md:h-80 rounded-2xl" />;
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {banners.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          pagination={{ 
            clickable: true,
            // Custom classes to ensure dots are visible and styled for dark/light mode
            bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-4',
          }}
          autoplay={{
            delay: 4000, // 4 seconds auto slide
            disableOnInteraction: false,
          }}
          className="w-full h-48 sm:h-64 md:h-80 rounded-2xl shadow-lg"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <a
                href={banner.link_url || '#'}
                target={banner.link_url ? '_self' : '_self'}
                rel="noopener noreferrer"
                className={cn(
                  "block w-full h-full overflow-hidden",
                  !banner.link_url && "pointer-events-none cursor-default"
                )}
              >
                <img
                  src={banner.image_url}
                  alt={banner.title || `Banner ${index + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  loading="lazy"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl p-8 text-center h-48 sm:h-64 md:h-80 flex items-center justify-center">
          Nenhum banner disponível no momento
        </div>
      )}
    </div>
  );
}