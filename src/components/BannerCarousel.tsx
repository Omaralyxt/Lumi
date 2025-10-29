"use client";

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getBanners } from '@/api/products';
import { Skeleton } from './ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  active: boolean;
}

const OPTIONS: EmblaOptionsType = { 
  loop: true,
  align: 'start',
};

const AUTOPLAY_OPTIONS = {
  delay: 4000, // 4 seconds auto slide
  stopOnInteraction: false,
  stopOnMouseEnter: true,
};

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [Autoplay(AUTOPLAY_OPTIONS)]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect);
      onSelect(emblaApi);
    }
  }, [emblaApi, onSelect]);

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
    return <Skeleton className="w-full h-48 rounded-2xl" />;
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
        <div className="embla overflow-hidden rounded-2xl shadow-lg" ref={emblaRef}>
          <div className="embla__container flex touch-pan-y">
            {banners.map((banner, index) => (
              <div 
                className="embla__slide flex-shrink-0 w-full min-w-0" 
                key={banner.id}
              >
                <a
                  href={banner.link_url || '#'}
                  target={banner.link_url ? '_self' : '_self'}
                  rel="noopener noreferrer"
                  className={cn(
                    "block w-full h-48 sm:h-64 md:h-80 overflow-hidden",
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
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl p-8 text-center h-48 flex items-center justify-center">
          Nenhum banner disponível no momento
        </div>
      )}
      
      {/* Dots Navigation */}
      {emblaApi && banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi.scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === selectedIndex ? "bg-white w-4" : "bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}