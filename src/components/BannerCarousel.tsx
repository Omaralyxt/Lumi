import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000); // Troca a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
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
    <div className="relative w-full overflow-hidden">
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

      {/* Navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

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