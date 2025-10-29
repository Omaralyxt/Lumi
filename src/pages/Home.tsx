import React from 'react';
import BannerCarousel from '@/components/BannerCarousel';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/api/products';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Store, Truck } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
    <div className="text-primary mb-3">{icon}</div>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const Home: React.FC = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['allProducts'],
    queryFn: getAllProducts,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Banner Carousel (Full Width) - Moved outside the main container structure */}
      <div className="mb-8">
        <BannerCarousel />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-8">
        {/* Features Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Truck size={32} />} 
              title="Entrega Rápida" 
              description="Receba seus produtos em 24-48 horas em Maputo." 
            />
            <FeatureCard 
              icon={<Store size={32} />} 
              title="Lojas Locais" 
              description="Apoie vendedores e artesãos moçambicanos." 
            />
            <FeatureCard 
              icon={<ShoppingBag size={32} />} 
              title="Compra Segura" 
              description="Transações protegidas e garantia de devolução." 
            />
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Produtos em Destaque</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-lg" />
              ))
            ) : (
              products?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>

        {/* Placeholder for Categories or other sections */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;