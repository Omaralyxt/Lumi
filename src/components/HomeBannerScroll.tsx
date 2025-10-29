"use client";

import { useState, useEffect } from 'react';
import { getBanners } from '@/api/products';
import { Skeleton } from './ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  active: boolean;
}

export default function HomeBannerScroll() {
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
    <div className="w-full overflow-hidden mt-4">
      {banners.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2">
          {banners.map((banner, index) => (
            <a
              key={banner.id}
              href={banner.link_url || '#'}
              target={banner.link_url ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="block flex-shrink-0"
              style={{ pointerEvents: banner.link_url ? 'auto' : 'none' }}
            >
              <img
                src={banner.image_url}
                alt={banner.title || `Banner ${index + 1}`}
                className="rounded-2xl shadow-md object-cover h-48 w-[80vw] sm:w-[45vw] md:w-[30vw] transition-transform duration-500 hover:scale-[1.02] dark:shadow-lg dark:shadow-blue-900/30"
              />
            </a>
          ))}
        </div>
      ) : (
        <div className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl p-8 text-center">
          Nenhum banner disponível no momento
        </div>
      )}
    </div>
  );
}