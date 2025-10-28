"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link: string;
  active: boolean;
}

interface BannerCarouselProps {
  banners: Banner[];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function BannerCarousel({ banners, onSwipeLeft, onSwipeRight }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Função para detectar toque
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe para a esquerda - próxima imagem ou próxima página
      if (currentIndex < banners.length - 1) {
        goToNext();
      } else if (onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (isRightSwipe) {
      // Swipe para a direita - imagem anterior ou página anterior
      if (currentIndex > 0) {
        goToPrevious();
      } else if (onSwipeRight) {
        onSwipeRight();
      }
    }
    
    // Reset touch positions
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length, isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (banners.length === 0) return null;

  return (
    <div 
      ref={carouselRef}
      className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, index) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            index === currentIndex 
              ? "opacity-100 translate-x-0" 
              : index < currentIndex 
                ? "-translate-x-full opacity-0" 
                : "translate-x-full opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <img 
              src={banner.image_url} 
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
              <div className="max-w-2xl px-8 text-white">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                <p className="text-lg md:text-xl mb-4">{banner.description}</p>
                {banner.link && (
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => window.open(banner.link, "_blank")}
                  >
                    Saiba mais
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 md:flex hidden"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 md:flex hidden"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Mobile swipe indicators */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-1 md:hidden">
        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
}