"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import RelatedProductsSection from '@/components/RelatedProductsSection';
import { ProductGallery } from '@/components/sales/ProductGallery';
import { ProductInfo } from '@/components/sales/ProductInfo';
import { ProductDescription } from '@/components/sales/ProductDescription';
import { ProductReviews } from '@/components/sales/ProductReviews';
import { Product as ProductType, ProductVariant, Review } from '@/types/product'; // Importando tipos completos

// Tipos de dados (simplificados para a busca)
interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

interface SupabaseProduct {
  id: string;
  name: string;
  description: string;
  shipping_cost: number;
  store_id: string;
  category: string;
  video_url: string | null; // Adicionado video_url
  specifications: Record<string, string> | null; // Adicionado specifications
  stores: { name: string, active: boolean, created_at: string } | null;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
}

// Função de busca de produto
const fetchProduct = async (productId: string): Promise<ProductType> => {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      description,
      shipping_cost,
      category,
      created_at,
      video_url,
      specifications,
      stores (id, name, active, created_at),
      product_variants (id, name, price, stock, image_url),
      product_images (id, image_url, sort_order)
    `
    )
    .eq('id', productId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const productData = data as SupabaseProduct;

  // Mapeamento completo para o tipo ProductType
  const storeName = productData.stores?.name || 'Loja Desconhecida';
  const storeId = productData.stores?.id || 'unknown';
  
  const images = productData.product_images ? productData.product_images.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url) : [];
  
  // Mock de dados complexos (Reviews, Q&A)
  const mockReviews: Review[] = [
    { id: 1, author: "Maria S.", date: "15/10/2024", rating: 5, comment: "Produto excelente!", helpful: 42, verifiedPurchase: true },
    { id: 2, author: "João P.", date: "10/10/2024", rating: 4, comment: "Muito bom", helpful: 28, verifiedPurchase: true },
  ];
  
  // Usando specifications do DB, com fallback para objeto vazio
  const specifications = productData.specifications || {};

  return {
    id: productData.id,
    title: productData.name,
    description: productData.description || 'Sem descrição.',
    price: productData.product_variants[0]?.price || 0,
    originalPrice: undefined, // Não temos originalPrice no DB
    rating: 4.7, // Mocked rating
    reviewCount: 1247, // Mocked count
    shop: {
      id: storeId,
      name: storeName,
      rating: 4.7,
      reviewCount: 1247,
      isVerified: productData.stores?.active || false,
      memberSince: productData.stores?.created_at ? new Date(productData.stores.created_at).toLocaleDateString('pt-MZ', { year: 'numeric' }) : 'N/A',
    },
    stock: productData.product_variants[0]?.stock || 0,
    category: productData.category || 'Outros',
    features: [],
    specifications: specifications, // Usando dados do DB
    deliveryInfo: { city: 'Maputo', fee: productData.shipping_cost || 0, eta: '1-2 dias' },
    reviews: mockReviews, // Usando mock
    qa: [],
    images: images.length > 0 ? images : ['/placeholder.svg'],
    options: [],
    variants: productData.product_variants,
    timeDelivery: '2-5 dias úteis',
    videoUrl: productData.video_url, // Adicionando videoUrl
  } as ProductType;
};


// Componente principal da página de vendas
export default function SalesPage() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useQuery<ProductType, Error>({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId!),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
        <Card className="p-8 text-center dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-red-500">Erro ao carregar produto</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">O produto solicitado não foi encontrado ou ocorreu um erro.</p>
          <Button onClick={() => navigate('/')} className="mt-4">Voltar para a Home</Button>
        </Card>
      </div>
    );
  }
  
  // Mapeamento de imagens para o formato ProductGallery espera
  const galleryItems = product.images.map((url, index) => ({
    id: `img-${index}`,
    image_url: url,
    sort_order: index,
    type: 'image' as const,
  }));
  
  // Adicionar vídeo se existir
  if (product.videoUrl) {
    galleryItems.unshift({
      id: 'video-0',
      image_url: product.videoUrl, // Usamos image_url para armazenar o URL do vídeo temporariamente
      sort_order: -1,
      type: 'video' as const,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg dark:border dark:border-gray-800">
          <ProductGallery images={galleryItems} />
          <ProductInfo product={product} variants={product.variants} />
        </div>

        {/* Product Description & Reviews (Horizontal Layout on Large Screens) */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Description & Specs */}
          <div>
            <ProductDescription product={product} />
          </div>

          {/* Reviews */}
          <div>
            <ProductReviews 
              reviews={product.reviews} 
              rating={product.rating} 
              reviewCount={product.reviewCount} 
            />
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <RelatedProductsSection 
            currentProductId={product.id}
            currentProductCategory={product.category}
          />
        </div>
      </div>
    </div>
  );
}