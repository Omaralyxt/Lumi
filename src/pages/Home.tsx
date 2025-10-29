"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedProducts, getBanners as getActiveBanners } from '@/api/products';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext'; // Corrigido o import do useCart
import { formatCurrency } from '@/lib/utils';

// Mock data for features (since we don't have a dedicated API for this yet)
const features = [
  { icon: '🚚', title: 'Entrega Rápida', description: 'Receba em 24h em Maputo.' },
  { icon: '💳', title: 'Pagamento Seguro', description: 'M-Pesa, Cartão e mais.' },
  { icon: '⭐', title: 'Melhores Vendedores', description: 'Lojas verificadas e confiáveis.' },
];

// Mock data for featured stores (to be replaced by API call later)
const mockStores = [
  { id: '1', name: 'Tech Hub', logo: '💻', rating: 4.9 },
  { id: '2', name: 'Moda Chic', logo: '👠', rating: 4.7 },
  { id: '3', name: 'Casa Feliz', logo: '🛋️', rating: 4.5 },
];

export default function Home() {
  const navigate = useNavigate();
  // Nota: useAuth retorna { user, isAuthenticated, loading }, não { session }
  const { isAuthenticated } = useAuth(); 
  const { cartItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Banners
  const { data: banners, isLoading: isLoadingBanners } = useQuery({
    queryKey: ['activeBanners'],
    queryFn: getActiveBanners,
  });

  // Fetch Featured Products
  const { data: featuredProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  const totalCartItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    navigate(`/category/${slug}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/sales/${productId}`); // Corrigido para usar a rota /sales/:id
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] dark:bg-gray-900">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold dark:text-white">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => navigate('/categories')}
                    >
                      Todas as Categorias
                    </Button>
                    <Separator className="dark:bg-gray-700" />
                    {PRODUCT_CATEGORIES.map(group => (
                      <div key={group.group}>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{group.group}</h3>
                        <ul className="space-y-1 ml-2">
                          {group.categories.slice(0, 5).map(category => (
                            <li key={category}>
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => handleCategoryClick(category)}
                              >
                                {category}
                              </Button>
                            </li>
                          ))}
                          {group.categories.length > 5 && (
                            <li>
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-sm text-blue-600 dark:text-blue-400"
                                onClick={() => navigate('/categories')}
                              >
                                Ver mais...
                              </Button>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                    <Separator className="dark:bg-gray-700" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
                    >
                      {isAuthenticated ? 'Meu Perfil' : 'Entrar / Cadastrar'}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">Lumi</h1>
            </div>

            {/* Search Bar (Desktop/Tablet) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Buscar produtos, lojas, categorias..."
                  className="w-full pr-12 bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" size="icon" className="absolute right-0 top-0 h-full rounded-l-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(isAuthenticated ? '/account' : '/login')}>
                <User className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/cart')} className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                {totalCartItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                    {totalCartItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Search Bar (Mobile) */}
          <form onSubmit={handleSearch} className="md:hidden mt-3">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar produtos, lojas, categorias..."
                className="w-full pr-12 bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon" className="absolute right-0 top-0 h-full rounded-l-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-8 dark:bg-gray-950">
        {/* Features Section */}
        <div className="mb-12 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="dark:bg-gray-900 dark:border-gray-700">
                <CardContent className="flex items-center p-4">
                  <div className="text-3xl mr-4">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Banner Carousel */}
        <section className="mb-12">
          {isLoadingBanners ? (
            <Skeleton className="w-full h-48 md:h-72 rounded-lg" />
          ) : banners && banners.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {banners.map((banner) => (
                  <CarouselItem key={banner.id}>
                    <div 
                      className="relative w-full h-48 md:h-72 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => banner.link_url && navigate(banner.link_url)}
                    >
                      <img 
                        src={banner.image_url} 
                        alt={banner.title || 'Banner'} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                        <div className="text-white">
                          {banner.title && <h2 className="text-xl md:text-3xl font-bold">{banner.title}</h2>}
                          {banner.description && <p className="text-sm md:text-base hidden sm:block">{banner.description}</p>}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12 dark:bg-gray-800 dark:text-white" />
              <CarouselNext className="mr-12 dark:bg-gray-800 dark:text-white" />
            </Carousel>
          ) : (
            <div className="w-full h-48 md:h-72 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
              Nenhum banner ativo.
            </div>
          )}
        </section>

        {/* Featured Categories Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compre por Categoria</h2>
            <Button variant="link" className="text-blue-600 dark:text-blue-400" onClick={() => navigate('/categories')}>
              Ver Todas <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {PRODUCT_CATEGORIES.slice(0, 6).map((group) => {
              const categoryName = group.categories[0] || group.group;
              return (
                <Card 
                  key={group.group} 
                  className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-700"
                  onClick={() => handleCategoryClick(categoryName)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">{group.icon || '📦'}</div>
                    <h3 className="font-semibold text-sm line-clamp-2 dark:text-white">{group.group}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Produtos em Destaque</h2>
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {featuredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-700"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative h-32 sm:h-40 overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={product.images[0] || 'https://via.placeholder.com/300x200?text=Produto'} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 dark:text-white">{product.title}</h3>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                      MT {product.price.toLocaleString('pt-MZ')}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{product.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="ml-2">({product.reviewCount || 0})</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Nenhum produto em destaque encontrado.
            </div>
          )}
        </section>

        {/* Featured Stores Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lojas em Destaque</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {mockStores.map((store) => (
              <Card 
                key={store.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-700"
                onClick={() => navigate(`/store/${store.id}`)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="text-4xl mb-2">{store.logo}</div>
                  <h3 className="font-semibold text-base line-clamp-1 dark:text-white">{store.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{store.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}