"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
}

// Função para extrair o ID do vídeo do YouTube
const getYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Função para gerar o iframe de incorporação
const generateEmbedCode = (url: string): { type: 'youtube' | 'unsupported' | 'direct'; embedUrl: string } => {
  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&showinfo=0&autoplay=0`,
    };
  }
  
  // Para outros links (TikTok, Facebook), a lógica de extração é mais complexa e específica.
  // Por enquanto, vamos tratar como URL direto ou não suportado.
  // Se for um link direto de arquivo (que o usuário pode ter inserido), usamos a tag <video>
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return { type: 'direct', embedUrl: url };
  }

  return { type: 'unsupported', embedUrl: url };
};

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url }) => {
  const { type, embedUrl } = generateEmbedCode(url);

  if (type === 'youtube') {
    return (
      <iframe
        className="w-full h-full"
        src={embedUrl}
        title="Embedded YouTube Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      ></iframe>
    );
  }
  
  if (type === 'direct') {
    // Se for um link direto de arquivo, voltamos para a tag <video>
    return (
      <video controls playsInline className="w-full h-full object-cover bg-black">
        <source src={embedUrl} type={embedUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        Seu navegador não suporta a tag de vídeo.
      </video>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 p-4 text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Formato de vídeo não suportado ou URL inválido.
      </p>
      <p className="text-xs text-gray-500 mt-1 truncate w-full">{url}</p>
    </div>
  );
};