"use client";

import React, { useState } from "react";
import { ProductGalleryItem } from "@/types/product"; // Usando o novo tipo
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductGalleryItem[];
}

// Função auxiliar para determinar o tipo MIME básico
const getMimeType = (url: string) => {
  if (url.endsWith('.mp4')) return 'video/mp4';
  if (url.endsWith('.webm')) return 'video/webm';
  if (url.endsWith('.ogg')) return 'video/ogg';
  return 'video/mp4'; // Default para o formato mais comum
};

export function ProductGallery({ images }: ProductGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
        <span className="text-gray-500 dark:text-gray-400">Imagem não disponível</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel className="w-full relative">
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={item.id}>
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                {item.type === 'video' ? (
                  <video 
                    controls 
                    playsInline // Importante para mobile
                    className="w-full h-full object-cover bg-black"
                    // Removendo o poster, pois ele pode ser a causa da tela preta se o URL for inválido
                  >
                    <source src={item.image_url} type={getMimeType(item.image_url)} />
                    Seu navegador não suporta a tag de vídeo.
                  </video>
                ) : (
                  <ImageWithFallback
                    src={item.image_url}
                    alt={`Produto ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Botões de navegação */}
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white dark:bg-gray-800/70 dark:hover:bg-gray-800" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white dark:bg-gray-800/70 dark:hover:bg-gray-800" />
          </>
        )}
      </Carousel>
    </div>
  );
}