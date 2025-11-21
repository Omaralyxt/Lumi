"use client";

import React from 'react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { VideoEmbed } from './VideoEmbed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Video } from 'lucide-react';

interface DetailedMediaItem {
  url: string;
  type: 'image' | 'video';
}

interface ProductDetailedMediaProps {
  media: DetailedMediaItem[];
}

export function ProductDetailedMedia({ media }: ProductDetailedMediaProps) {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2">
        Detalhes Visuais
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {media.map((item, index) => (
          <Card key={index} className="overflow-hidden dark:bg-gray-900 dark:border-gray-700">
            <div className="aspect-video w-full">
              {item.type === 'image' ? (
                <ImageWithFallback
                  src={item.url}
                  alt={`Detalhe ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <VideoEmbed url={item.url} />
              )}
            </div>
            <CardContent className="p-3 text-sm text-gray-600 dark:text-gray-400 flex items-center">
              {item.type === 'image' ? (
                <Image className="h-4 w-4 mr-2" />
              ) : (
                <Video className="h-4 w-4 mr-2" />
              )}
              {item.type === 'image' ? `Imagem de Detalhe ${index + 1}` : `Vídeo de Demonstração ${index + 1}`}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}