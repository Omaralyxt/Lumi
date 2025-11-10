"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Truck, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

// Tipos de dados (simplificados)
interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  shipping_cost: number;
  store_id: string;
  store_name: string;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
}

// Função de busca de produto
const fetchProduct = async (productId: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      description,
      shipping_cost,
      store_id,
      stores (name),
      product_variants (id, name, price, stock),
      product_images (id, image_url, sort_order)
    `
    )
    .eq('id', productId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Mapear dados para o formato Product
  const storeName = Array.isArray(data.stores) ? data.stores[0]?.name : data.stores?.name || 'Loja Desconhecida';

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    shipping_cost: data.shipping_cost || 0,
    store_id: data.store_id,
    store_name: storeName,
    product_variants: data.product_variants || [],
    product_images: data.product_images ? data.product_images.sort((a, b) => a.sort_order - b.sort_order) : [],
  };
};

// Componente de Carrossel de Imagens
interface ImageCarouselProps {
  images: ProductImage[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">Sem Imagem</div>;
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
      <img
        src={images[currentIndex].image_url}
        alt={`Imagem ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      
      {images.length > 1 && (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};


// Componente principal da página de vendas
export default function SalesPage() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId!),
    enabled: !!productId,
  });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.product_variants.length > 0) {
      setSelectedVariant(product.product_variants[0]);
    }
  }, [product]);

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

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Por favor, selecione uma variante do produto.");
      return;
    }
    if (quantity <= 0 || quantity > selectedVariant.stock) {
      toast.error(`Quantidade inválida. Máximo disponível: ${selectedVariant.stock}`);
      return;
    }

    // Mapeamento simplificado para o CartContext (que espera o tipo Product)
    // Nota: O CartContext espera um objeto Product completo, mas aqui estamos passando
    // apenas os dados essenciais da variante. Isso pode causar problemas se o CartContext
    // tentar acessar campos como `images[0]` ou `shop.name` diretamente do item.
    // Para corrigir isso, precisamos garantir que o objeto passado para `addToCart`
    // tenha a estrutura mínima de `Product` ou que o `CartContext` seja adaptado.
    
    // Revertendo para a estrutura completa do Product (como era antes)
    // Para evitar quebrar o CartContext, vamos buscar o objeto Product completo
    // e usar a variante selecionada para definir o preço/estoque.
    
    // Como não temos o objeto Product completo aqui, vamos simular a estrutura mínima
    // que o CartContext espera, usando os dados que temos.
    
    const productForCart = {
      id: selectedVariant.id, // Usamos o ID da variante como ID do item no carrinho
      title: product.name,
      description: product.description,
      price: selectedVariant.price,
      originalPrice: undefined,
      rating: 4.5,
      reviewCount: 0,
      shop: {
        id: product.store_id,
        name: product.store_name,
        rating: 4.5,
        reviewCount: 0,
        isVerified: true,
      },
      stock: selectedVariant.stock,
      category: 'Outros', // Mocked
      features: [],
      specifications: {},
      deliveryInfo: { city: 'Maputo', fee: product.shipping_cost, eta: '1-2 dias' },
      reviews: [],
      qa: [],
      images: product.product_images.map(img => img.image_url),
      options: [{ name: "Variante", values: [selectedVariant.name] }],
      variants: product.product_variants,
      timeDelivery: '2-5 dias úteis',
    };

    addToCart(productForCart as any, quantity);
    toast.success(`${quantity}x ${product.name} (${selectedVariant.name}) adicionado ao carrinho!`);
  };

  const currentPrice = selectedVariant ? selectedVariant.price : (product.product_variants[0]?.price || 0);
  const currentStock = selectedVariant ? selectedVariant.stock : (product.product_variants[0]?.stock || 0);
  const isOutOfStock = currentStock <= 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Product Images */}
          <div className="space-y-4">
            <ImageCarousel images={product.product_images} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <Badge variant="secondary" className="text-xs font-medium dark:bg-blue-900/30 dark:text-blue-300">
              Vendido por: {product.store_name}
            </Badge>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            
            {/* Price and Rating */}
            <div className="flex items-baseline space-x-4">
              <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                MT {currentPrice.toLocaleString('pt-MZ')}
              </p>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-yellow-500" />
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">(4.5)</span>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            {/* Variants Selection */}
            {product.product_variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Opções:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                      className={`
                        ${selectedVariant?.id === variant.id 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-neon-blue' 
                          : 'border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }
                        ${variant.stock <= 0 && 'opacity-50 cursor-not-allowed line-through'}
                      `}
                      onClick={() => !variant.stock <= 0 && setSelectedVariant(variant)}
                      disabled={variant.stock <= 0}
                    >
                      {variant.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock and Quantity */}
            <div className="flex items-center space-x-6">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Estoque: 
                <span className={`ml-1 font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-500'}`}>
                  {isOutOfStock ? 'Esgotado' : currentStock}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-800 dark:text-gray-200">Qtd:</label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={currentStock}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0 && value <= currentStock) {
                      setQuantity(value);
                    } else if (value > currentStock) {
                      setQuantity(currentStock);
                    } else {
                      setQuantity(1);
                    }
                  }}
                  className="w-16 text-center dark:bg-gray-800 dark:border-gray-700"
                  disabled={isOutOfStock}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg shadow-lg shadow-blue-500/50 dark:shadow-blue-800/50 transition-all duration-300"
                onClick={handleAddToCart}
                disabled={isOutOfStock || !selectedVariant}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" size="icon" className="dark:border-gray-700 dark:hover:bg-gray-700">
                <Heart className="h-5 w-5 text-red-500" />
              </Button>
            </div>

            <Separator className="dark:bg-gray-700" />

            {/* Shipping Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <Truck className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Custo de Envio: MT {product.shipping_cost.toLocaleString('pt-MZ')}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                O custo de envio é fixo por loja. O valor final será calculado no checkout.
              </p>
            </div>

            {/* Description */}
            <div className="pt-4">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Descrição do Produto</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {product.description || 'Nenhuma descrição detalhada fornecida para este produto.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}