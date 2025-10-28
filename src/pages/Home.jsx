"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Search, 
  Filter, 
  Package, 
  Store,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  Smartphone,
  Laptop,
  Home as HomeIcon,
  Shirt,
  Book,
  Gamepad,
  Camera,
  Car,
  Heart as HeartIcon,
  Truck,
  Shield,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";
import BannerCarousel from "@/components/BannerCarousel";
import SwipeablePage from "@/components/SwipeablePage";
import { getFeaturedProducts } from "@/api/products";
import { searchProducts, getCategoryCounts } from "@/api/search";
import ProductGrid from "@/components/ProductGrid";

const LOGO_URL = "https://kxvyveizgrnieetbttjx.supabase.co/storage/v1/object/public/Banners%20and%20Logos/logo/Logo%20Lumi.png";

// Mock data for banners
const banners = [
  {
    id: 1,
    title: "Ofertas Especiais",
    description: "Descontos de até 50% em eletrônicos selecionados",
    image_url: "/placeholder.svg",
    link: "/offers",
    active: true
  },
  {
    id: 2,
    title: "Novidades da Semana",
    description: "Confira os produtos recém-chegados",
    image_url: "/placeholder.svg",
    link: "/new-arrivals",
    active: true
  },
  {
    id: 3,
    title: "Frete Grátis",
    description: "Em compras acima de MT 5000 para todo o país",
    image_url: "/placeholder.svg",
    link: "/free-shipping",
    active: true
  }
];

// Mock data for secondary banners
const secondaryBanners = [
  { id: 1, title: "Super Descontos", image_url: "/placeholder.svg", link: "/offers" },
  { id: 2, title: "Novos Vendedores", image_url: "/placeholder.svg", link: "/stores" },
  { id: 3, title: "Acessórios Essenciais", image_url: "/placeholder.svg", link: "/category/eletronicos" },
];

// Mock data for categories
const categories = [
  { id: 1, name: "Eletrónicos", icon: Smartphone, color: "bg-blue-100 text-blue-600", count: 0, slug: "eletronicos" },
  { id: 2, name: "Computadores", icon: Laptop, color: "bg-purple-100 text-purple-600", count: 0, slug: "computadores" },
  { id: 3, name: "Casa & Cozinha", icon: HomeIcon, color: "bg-green-100 text-green-600", count: 0, slug: "casa-cozinha" },
  { id: 4, name: "Moda", icon: Shirt, color: "bg-pink-100 text-pink-600", count: 0, slug: "moda" },
  { id: 5, name: "Livros", icon: Book, color: "bg-yellow-100 text-yellow-600", count: 0, slug: "livros" },
  { id: 6, name: "Jogos", icon: Gamepad, color: "bg-red-100 text-red-600", count: 0, slug: "jogos" },
  { id: 7, name: "Fotografia", icon: Camera, color: "bg-indigo-100 text-indigo-600", count: 0, slug: "fotografia" },
  { id: 8, name: "Automóvel", icon: Car, color: "bg-gray-100 text-gray-600", count: 0, slug: "automovel" },
];

// Componente para o Header Focado (Logo + Busca)
const HomeHeader = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <div className="sticky top-16 md:top-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-300 dark:border-neutral-800 pt-4 pb-3 px-4 md:px-8">
    <div className="max-w-7xl mx-auto">
      {/* Logo Centralizado (Apenas em Mobile, no Desktop o AppLayout já tem) */}
      <div className="flex justify-center md:hidden mb-3">
        <img src={LOGO_URL} alt="Lumi Logo" className="h-10 w-auto" />
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar produtos, lojas ou marcas..."
            className="w-full pl-12 pr-4 py-3 text-gray-900 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  </div>
);

// Componente para Banners Secundários
const SecondaryBanners = ({ banners }) => (
  <div className="grid grid-cols-3 gap-4 overflow-x-auto scrollbar-hide py-4">
    {banners.map((banner) => (
      <motion.div
        key={banner.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="flex-shrink-0 w-40 md:w-full cursor-pointer"
        onClick={() => window.location.href = banner.link}
      >
        <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-neon-blue transition-shadow">
          <img 
            src={banner.image_url} 
            alt={banner.title} 
            className="w-full h-24 object-cover" 
          />
          <CardContent className="p-2 text-center">
            <p className="text-sm font-semibold line-clamp-1">{banner.title}</p>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

// Componente para a seção de Categorias (Horizontal Scroll)
const CategorySection = ({ categories, navigate }) => (
  <div className="py-8">
    <h2 className="font-title text-3xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
      Explorar Categorias
    </h2>
    <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0 w-24 text-center cursor-pointer"
          onClick={() => navigate(`/category/${category.slug}`)}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${category.color} transition-colors`}>
            <category.icon className="h-8 w-8" />
          </div>
          <p className="text-sm font-medium line-clamp-1">{category.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{category.count} produtos</p>
        </motion.div>
      ))}
    </div>
  </div>
);

// Componente para a seção de Produtos (com título Bebas Neue)
const ProductSection = ({ title, products, loading, navigate, sectionId, showStoreInfo = false }) => (
  <div id={sectionId} className="py-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-title text-3xl font-bold tracking-wide text-gray-900 dark:text-white">
        {title}
      </h2>
      <Button variant="link" size="sm" onClick={() => navigate("/offers")}>
        Ver mais <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>

    {loading ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl"></Card>
        ))}
      </div>
    ) : products.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum produto encontrado nesta seção.</p>
      </div>
    ) : (
      <ProductGrid products={products} showStoreInfo={showStoreInfo} />
    )}
  </div>
);


export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for data fetching
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [categoryData, setCategoryData] = useState(categories);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Category Counts
      try {
        const counts = await getCategoryCounts();
        setCategoryData(prevCategories => 
          prevCategories.map(cat => ({
            ...cat,
            count: counts[cat.name] || 0,
          }))
        );
      } catch (e) {
        console.error("Failed to fetch category counts:", e);
      }

      // 2. Fetch Featured Products
      try {
        setLoadingProducts(true);
        const featured = await getFeaturedProducts();
        setFeaturedProducts(featured);
      } catch (e) {
        console.error("Failed to fetch featured products:", e);
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }

      // 3. Fetch Offers (simulated)
      try {
        setLoadingOffers(true);
        const allProducts = await searchProducts("", undefined, undefined, 4);
        const simulatedOffers = allProducts.slice(0, 4).map(p => ({
          ...p,
          originalPrice: p.price * 1.25,
          price: p.price,
          discount: 20,
          timeDelivery: "24h restantes"
        }));
        setOffers(simulatedOffers);
      } catch (e) {
        console.error("Failed to fetch offers:", e);
        setOffers([]);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <SwipeablePage currentPage="home">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 md:pt-0">
        
        {/* Novo Header Focado (Logo + Busca) */}
        <HomeHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch} 
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          
          {/* 1. Banner Principal (Hero) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <BannerCarousel banners={banners} />
          </motion.div>

          {/* 2. Banners Secundários / Promocionais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <SecondaryBanners banners={secondaryBanners} />
          </motion.div>
          
          {/* 3. Seção de Categorias (Horizontal) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <CategorySection categories={categoryData} navigate={navigate} />
          </motion.div>

          {/* 4. Seção de Ofertas do Dia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ProductSection 
              title="Ofertas do Dia" 
              products={offers} 
              loading={loadingOffers} 
              navigate={navigate}
              sectionId="offers-section"
            />
          </motion.div>
          
          {/* 5. Seção de Produtos em Destaque */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ProductSection 
              title="Produtos em Destaque" 
              products={featuredProducts} 
              loading={loadingProducts} 
              navigate={navigate}
              sectionId="featured-section"
            />
          </motion.div>

          {/* 6. Seção de Vantagens (Features) */}
          <div className="py-12">
            <h2 className="font-title text-3xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
              Por que comprar na Lumi?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: 1, icon: Truck, title: "Entrega Rápida", description: "Receba seus produtos em 1-3 dias úteis em todo o país.", color: 'bg-blue-100 text-blue-600' },
                { id: 2, icon: Shield, title: "Pagamento Seguro", description: "Transações seguras com múltiplos métodos de pagamento.", color: 'bg-green-100 text-green-600' },
                { id: 3, icon: Headphones, title: "Suporte 24/7", description: "Equipe de suporte disponível para ajudar em qualquer dúvida.", color: 'bg-purple-100 text-purple-600' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-neon-blue transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SwipeablePage>
  );
}