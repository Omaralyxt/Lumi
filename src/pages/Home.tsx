"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getBanners, getFeaturedProducts } from '@/api/products';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Componente de Banner
const BannerCarousel = ({ banners }: { banners: { id: string; image_url: string; link: string }[] }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="p-1">
              <Card className="border-none shadow-none">
                <CardContent className="flex aspect-video items-center justify-center p-0">
                  <a href={banner.link} className="w-full h-full">
                    <img
                      src={banner.image_url}
                      alt={`Banner ${banner.id}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
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

// Componente de Produto
interface Product {
  id: string;
  name: string;
  image_url: string;
  price: number;
  store_name: string;
  store_id: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleViewProduct = () => {
    navigate(`/sales/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simplificado: Adiciona o produto principal (assumindo que o preço é o da variante padrão)
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      images: [product.image_url],
      shop: { id: product.store_id, name: product.store_name, rating: 4.5, reviewCount: 0, isVerified: true },
      stock: 10, // Mocked
      category: 'Outros', // Mocked
      features: [],
      specifications: {},
      deliveryInfo: { city: 'Maputo', fee: 150, eta: '1-2 dias' },
      options: [],
      variants: [],
      rating: 4.5,
      reviewCount: 0,
      timeDelivery: '2-5 dias úteis',
    }, 1);
  };

  return (
    <Card 
      className="w-full cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800"
      onClick={handleViewProduct}
    >
      <CardContent className="p-0">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">{product.store_name}</p>
          <h3 className="font-body font-medium text-sm line-clamp-2 mb-2 dark:text-white">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              MT {product.price.toLocaleString('pt-MZ')}
            </span>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              onClick={handleAddToCart}
            >
              +
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de Categoria Rápida
const QuickCategory = ({ name, icon }: { name: string; icon: string }) => {
  const navigate = useNavigate();
  const handleCategoryClick = () => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    navigate(`/category/${slug}`);
  };

  return (
    <div 
      className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity"
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
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const featured = await getFeaturedProducts();
      // Mapear para o formato simplificado esperado pelo ProductCard
      return featured.map(p => ({
        id: p.id as string,
        name: p.title,
        image_url: p.images[0],
        price: p.price,
        store_name: p.shop.name,
        store_id: p.shop.id,
      }));
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  // Quick Categories (Top 5 groups)
  const quickCategories = useMemo(() => {
    const icons: Record<string, string> = {
      "Moda e Estilo": '👗',
      "Tecnologia e Eletrônicos": '📱',
      "Casa e Decoração": '🏠',
      "Eletrodomésticos": '🧺',
      "Beleza e Cuidados Pessoais": '💄',
    };
    return PRODUCT_CATEGORIES.slice(0, 5).map(group => ({
      name: group.group,
      icon: icons[group.group] || '📦',
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Banner Carousel (Full Width) */}
      <div className="mb-8">
        {isLoadingBanners ? (
          <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        ) : (
          <BannerCarousel banners={banners || []} />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Separator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Lumi</h1>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => navigate(session ? '/profile' : '/login')}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/cart')} className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search Input Removed */}
          <Separator className="dark:bg-gray-700" />
        </div>

        {/* Quick Categories */}
        <section className="py-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categorias Populares</h2>
          <div className="flex justify-between space-x-2 overflow-x-auto pb-2">
            {quickCategories.map((category) => (
              <QuickCategory key={category.name} name={category.name} icon={category.icon} />
            ))}
            <div 
              className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity min-w-[60px]"
              onClick={() => navigate('/categories')}
            >
              <div className="text-2xl p-3 bg-white dark:bg-gray-800 rounded-full shadow-md mb-1">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2">Todas</p>
            </div>
          </div>
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