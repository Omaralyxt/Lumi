"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Package, 
  Star, 
  ShoppingBag, 
  Heart, 
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  Eye,
  Plus,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Tipos de dados
interface Category {
  id: number;
  name: string;
  icon: string;
  clickCount: number;
}

interface Banner {
  id: number;
  imageUrl: string;
  link: string;
  priority: number;
  title?: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  shop: string;
  sold: number;
  discount?: number;
  category: string;
}

interface RecommendedProduct extends Product {
  reason: string;
}

// Mock data - em um app real, viria de API
const mockCategories: Category[] = [
  { id: 1, name: "Eletrónicos", icon: "📱", clickCount: 1250 },
  { id: 2, name: "Moda", icon: "👕", clickCount: 980 },
  { id: 3, name: "Casa & Cozinha", icon: "🏠", clickCount: 750 },
  { id: 4, name: "Saúde & Beleza", icon: "💄", clickCount: 620 },
  { id: 5, name: "Desporto", icon: "⚽", clickCount: 540 },
  { id: 6, name: "Livros", icon: "📚", clickCount: 480 },
  { id: 7, name: "Bebés & Crianças", icon: "👶", clickCount: 420 },
  { id: 8, name: "Automóvel", icon: "🚗", clickCount: 380 },
];

const mockBanners: Banner[] = [
  {
    id: 1,
    imageUrl: "/placeholder.svg",
    link: "/offers",
    priority: 1,
    title: "Super Descontos de Verão"
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg",
    link: "/categories",
    priority: 2,
    title: "Novas Categorias Lançadas"
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg",
    link: "/favorites",
    priority: 3,
    title: "Seus Favoritos com 20% OFF"
  }
];

const mockPopularProducts: Product[] = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    price: 12500,
    originalPrice: 15000,
    image: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 128,
    shop: "TechStore MZ",
    sold: 23,
    discount: 17,
    category: "Eletrónicos"
  },
  {
    id: 2,
    title: "Tênis Esportivo Nike Air Max",
    price: 2500,
    originalPrice: 3500,
    image: "/placeholder.svg",
    rating: 4.2,
    reviewCount: 89,
    shop: "ModaExpress",
    sold: 15,
    discount: 29,
    category: "Moda"
  },
  {
    id: 3,
    title: "Panela de Pressão Inox",
    price: 1800,
    originalPrice: 2200,
    image: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 156,
    shop: "CozinhaFeliz",
    sold: 31,
    discount: 18,
    category: "Casa & Cozinha"
  },
  {
    id: 4,
    title: "Fone de Ouvido Bluetooth",
    price: 1999,
    originalPrice: 2800,
    image: "/placeholder.svg",
    rating: 4.3,
    reviewCount: 67,
    shop: "TechStore MZ",
    sold: 42,
    discount: 29,
    category: "Eletrónicos"
  },
  {
    id: 5,
    title: "Smartwatch Xiaomi Mi Band",
    price: 1299,
    originalPrice: 1800,
    image: "/placeholder.svg",
    rating: 4.6,
    reviewCount: 234,
    shop: "TechStore MZ",
    sold: 67,
    discount: 28,
    category: "Eletrónicos"
  }
];

const mockRecommendedProducts: RecommendedProduct[] = [
  {
    id: 6,
    title: "Capa de Silicone para Smartphone",
    price: 350,
    originalPrice: 500,
    image: "/placeholder.svg",
    rating: 4.4,
    reviewCount: 45,
    shop: "TechStore MZ",
    sold: 89,
    discount: 30,
    category: "Eletrónicos",
    reason: "Complemento perfeito para seu smartphone"
  },
  {
    id: 7,
    title: "Creme Hidratante Facial",
    price: 1200,
    originalPrice: 1800,
    image: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 78,
    shop: "BelezaPlus",
    sold: 34,
    discount: 33,
    category: "Saúde & Beleza",
    reason: "Baseado em seus interesses em beleza"
  },
  {
    id: 8,
    title: "Mochila Esportiva",
    price: 2800,
    originalPrice: 3500,
    image: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 56,
    shop: "DesportoMax",
    sold: 28,
    discount: 20,
    category: "Desporto",
    reason: "Para suas atividades físicas"
  },
  {
    id: 9,
    title: "Livro: O Poder do Hábito",
    price: 800,
    originalPrice: 1200,
    image: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 234,
    shop: "LivrariaCentral",
    sold: 156,
    discount: 33,
    category: "Livros",
    reason: "Recomendado para seu perfil"
  }
];

const mockPromotionalBanners: Banner[] = [
  {
    id: 4,
    imageUrl: "/placeholder.svg",
    link: "/offers",
    priority: 1,
    title: "Frete Grátis em compras acima de MT 10.000"
  },
  {
    id: 5,
    imageUrl: "/placeholder.svg",
    link: "/categories",
    priority: 2,
    title: "Nova Coleção de Moda Infantil"
  }
];

// Componente de carrossel genérico
function HorizontalCarousel<T>({
  items,
  renderItem,
  title,
  loading = false
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  title: string;
  loading?: boolean;
}) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollLeft}
            className="h-8 w-8 p-0"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollRight}
            className="h-8 w-8 p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-2 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-32">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          ))
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-32">
              {renderItem(item, index)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Componente de banner
function BannerCard({ banner, onClick }: { banner: Banner; onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={banner.imageUrl} 
            alt={banner.title || "Banner"}
            className="w-full h-32 object-cover"
            loading="lazy"
          />
          {banner.title && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white font-medium text-sm text-center px-2">
                {banner.title}
              </h3>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de categoria
function CategoryCard({ category, onClick }: { category: Category; onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all hover:scale-105 rounded-lg"
      onClick={onClick}
    >
      <CardContent className="p-4 text-center">
        <div className="text-3xl mb-2">{category.icon}</div>
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
          {category.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {category.clickCount.toLocaleString()} cliques
        </p>
      </CardContent>
    </Card>
  );
}

// Componente de produto
function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="relative mb-3">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-24 object-cover rounded"
            loading="lazy"
          />
          {product.discount && (
            <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs">
              -{product.discount}%
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium text-xs text-gray-900 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs text-gray-600">{product.shop}</p>
          
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs">{product.rating}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{product.sold} vendidos</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-blue-600">
                MT {product.price.toLocaleString('pt-MZ')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-1">
                  MT {product.originalPrice.toLocaleString('pt-MZ')}
                </span>
              )}
            </div>
            <Button size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de produto recomendado
function RecommendedProductCard({ product, onClick }: { product: RecommendedProduct; onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden border border-blue-200"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="relative mb-3">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-28 object-cover rounded"
            loading="lazy"
          />
          {product.discount && (
            <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs">
              -{product.discount}%
            </Badge>
          )}
          <Badge className="absolute top-1 right-1 bg-blue-500 text-white text-xs">
            <Eye className="h-2 w-2 mr-1" />
            Recomendado
          </Badge>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium text-xs text-gray-900 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs text-gray-600">{product.shop}</p>
          
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs">{product.rating}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{product.sold} vendidos</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-blue-600">
                MT {product.price.toLocaleString('pt-MZ')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-1">
                  MT {product.originalPrice.toLocaleString('pt-MZ')}
                </span>
              )}
            </div>
            <Button size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <p className="text-xs text-blue-600 mt-2 font-medium">
            {product.reason}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [promotionalBanners, setPromotionalBanners] = useState<Banner[]>([]);

  useEffect(() => {
    // Simular carregamento de dados
    const loadData = async () => {
      setLoading(true);
      
      // Em um app real, chamadas de API aqui
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategories(mockCategories);
      setBanners(mockBanners);
      setPopularProducts(mockPopularProducts);
      setRecommendedProducts(mockRecommendedProducts);
      setPromotionalBanners(mockPromotionalBanners);
      
      setLoading(false);
    };

    loadData();
  }, []);

  const handleCategoryClick = (category: Category) => {
    // Navegar para página de categoria
    console.log(`Navegando para categoria: ${category.name}`);
  };

  const handleBannerClick = (banner: Banner) => {
    // Navegar para link do banner
    console.log(`Navegando para: ${banner.link}`);
  };

  const handleProductClick = (product: Product) => {
    // Navegar para página do produto
    console.log(`Navegando para produto: ${product.title}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Lumi</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar produtos, lojas..."
                  className="pl-10 pr-4 py-2"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ShoppingBag className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Seção 1 — Categorias em Alta (Carrossel) */}
        <HorizontalCarousel
          items={categories}
          title="Categorias em Alta"
          loading={loading}
          renderItem={(category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onClick={() => handleCategoryClick(category)} 
            />
          )}
        />

        {/* Seção 2 — Banner Publicitário */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ofertas do Dia</h2>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <Skeleton className="h-40 w-80 rounded-lg" />
                </div>
              ))
            ) : (
              banners.map((banner) => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  onClick={() => handleBannerClick(banner)}
                />
              ))
            )}
          </div>
        </div>

        {/* Seção 3 — Produtos em Alta (Carrossel) */}
        <HorizontalCarousel
          items={popularProducts}
          title="Produtos em Alta"
          loading={loading}
          renderItem={(product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => handleProductClick(product)} 
            />
          )}
        />

        {/* Seção 4 — Banner com produtos do interesse do cliente */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
              Produtos para Você
            </h2>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
          
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Descubra produtos personalizados para você!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Baseado em seu histórico de navegação e preferências
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Explorar Recomendações
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção 5 — Produtos de interesse do cliente (Carrossel) */}
        <HorizontalCarousel
          items={recommendedProducts}
          title="Recomendados para Você"
          loading={loading}
          renderItem={(product, index) => (
            <RecommendedProductCard 
              key={product.id} 
              product={product} 
              onClick={() => handleProductClick(product)} 
            />
          )}
        />

        {/* Seção 6 — Mais banners opcionais */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Promoções Especiais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              ))
            ) : (
              promotionalBanners.map((banner) => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  onClick={() => handleBannerClick(banner)}
                />
              ))
            )}
          </div>
        </div>

        {/* Seção de Call-to-Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Comece a vender hoje!</h3>
            <p className="text-blue-100 mb-4">
              Crie sua loja online e alcance milhares de clientes em Moçambique.
            </p>
            <Button variant="secondary" size="lg">
              Criar Loja Gratuita
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}