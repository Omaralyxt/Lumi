import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getBanners, syncBannersWithStorage } from '@/api/products';

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  active: boolean;
}

const BannerCarousel: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs para lidar com o swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50; // Distância mínima para considerar um swipe

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    // Sincroniza primeiro (se necessário)
    await syncBannersWithStorage();
    
    // Busca os banners ativos
    const fetchedBanners = await getBanners();
    setBanners(fetchedBanners);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Autoplay
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(nextSlide, 5000); // Troca a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [banners.length, nextSlide]);

  // Lógica de Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = 0; // Reset end position
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Resetar posições
    touchStartX.current = 0;
    touchEndX.current = 0;
  };


  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
        Nenhum banner disponível.
      </div>
    );
  }

  return (
    <div 
      className="relative w-full overflow-hidden cursor-grab"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container principal com altura definida para banners */}
      <div className="relative h-64 md:h-96 bg-white">
        {banners.map((banner, index) => (
          <a 
            key={index} 
            href={banner.link_url || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={banner.image_url}
              alt={banner.title || `Banner ${index + 1}`}
              className="w-full h-full object-contain transition-opacity duration-500"
            />
          </a>
        ))}
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-gray-400 bg-opacity-50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;