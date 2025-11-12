"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getBanners, getFeaturedProducts } from '@/api/products';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';
import { Product as ProductType } from '@/types/product';
import ProductCard from '@/components/ProductCard';

// Componente de Banner (Integrado e Responsivo)
const BannerCarousel = ({ banners }: { banners: { id: string | number; image_url: string; link_url: string }[] }) => {
  if (!banners || banners.length === 0) return null;

  const [api, setApi] = useState<CarouselApi>();

  // Implementação do Autoplay
  useEffect(() => {
    if (!api) return;

    const intervalTime = 5000; // 5 segundos
    let timer: NodeJS.Timeout;

    const startAutoplay = () => {
      timer = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0); // Volta ao início
        }
      }, intervalTime);
    };

    const stopAutoplay = () => {
      clearInterval(timer);
    };

    // Inicia o autoplay
    startAutoplay();

    // Pausa ao interagir (opcional, mas bom para UX)
    api.on("pointerDown", stopAutoplay);
    api.on("pointerUp", startAutoplay);
    
    // Limpeza
    return () => {
      stopAutoplay();
      api.off("pointerDown", stopAutoplay);
      api.off("pointerUp", startAutoplay);
    };
  }, [api]);


  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="p-1">
              <Card className="border-none shadow-none">
                <CardContent className="flex items-center justify-center p-0">
                  <a href={banner.link_url} className="w-full">
                    {/* Aspecto 16:9 para desktop, 4:3 para mobile */}
                    <div className="aspect-[16/9] md:aspect-[16/9] w-full">
                      <img
                        src={banner.image_url}
                        alt={`Banner ${banner.id}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </a>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

// Componente de Categoria Rápida
const QuickCategory = ({ name, icon }: { name: string; icon: string }) => {
  const navigate = useNavigate();
  const handleCategoryClick = () => {
    // Cria um slug a partir do nome do grupo para a URL (usando a rota CategoriesPage para listar subcategorias)
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    navigate(`/categories`); // Redireciona para a página de categorias para ver o grupo
  };

  return (
    <div 
      className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity w-full"
      onClick={handleCategoryClick}
    >
      <div className="text-2xl p-3 bg-white dark:bg-gray-800 rounded-full shadow-md mb-1">
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2">{name}</p>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { user: session, loading: authLoading } = useAuth();
  const { cartCount: totalItems } = useCart();

  // Fetch Banners
  const { data: banners, isLoading: isLoadingBanners } = useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch Products
  const { data: products, isLoading: isLoadingProducts } = useQuery<ProductType[]>({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts, // Agora retorna o tipo ProductType completo
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  // Quick Categories (Agora inclui TODOS os grupos)
  const quickCategories = useMemo(() => {
    const icons: Record<string, string> = {
      "Moda e Estilo": '👗',
      "Tecnologia e Eletrônicos": '📱',
      "Casa e Decoração": '🏠',
      "Eletrodomésticos": '🧺',
      "Beleza e Cuidados Pessoais": '💄',
      "Bebés e Crianças": '🧸',
      "Ferramentas e Construção": '🔨',
      "Automóveis e Motos": '🚗',
      "Papelaria e Escritório": '📚',
      "Esportes e Lazer": '⚽',
      "Supermercado e Alimentos": '🛒',
      "Saúde e Bem-estar": '💊',
      "Animais de Estimação": '🐾',
      "Entretenimento e Cultura": '🎬',
    };
    
    // Mapeia todos os grupos de categorias
    return PRODUCT_CATEGORIES.map(group => ({
      name: group.group,
      icon: icons[group.group] || '📦',
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Banner Carousel (Full Width) */}
      <div className="mb-8">
        {isLoadingBanners ? (
          <div className="w-full aspect-[16/9] md:aspect-[16/9] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        ) : (
          <BannerCarousel banners={banners || []} />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Quick Categories Carousel */}
        <section className="py-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categorias Populares</h2>
          
          <Carousel
            opts={{
              // Removendo align: "start" e adicionando dragFree: true
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {quickCategories.map((category, index) => (
                <CarouselItem 
                  key={category.name} 
                  // Ajuste para mostrar 5 ou 6 itens em telas pequenas/médias
                  className="basis-1/5 sm:basis-1/6 pl-2"
                >
                  <QuickCategory name={category.name} icon={category.icon as string} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </section>

        <Separator className="dark:bg-gray-700" />

        {/* Featured Products */}
        <section className="py-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Produtos em Destaque</h2>
          
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Usando o ProductCard externo que já está configurado para a rota /sales/:id */}
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}