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
  Sparkles,
  Gift,
  Percent,
  Truck,
  Shield,
  Headphones,
  Smartphone,
  Laptop,
  Home as HomeIcon,
  Utensils,
  Shirt,
  Book,
  Gamepad,
  Camera,
  Car,
  Heart as HeartIcon,
  Star as StarIcon,
  Eye,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/images/logo.svg";
import BannerCarousel from "@/components/BannerCarousel";
import SwipeablePage from "@/components/SwipeablePage";
import { getFeaturedProducts } from "@/api/products";
import { getFeaturedStores } from "@/api/stores";
import { searchProducts } from "@/api/search"; // Usado para simular ofertas

// Mock data for banners (mantido, pois não temos tabela de banners no Supabase)
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

// Mock data for categories (mantido)
const categories = [
  {
    id: 1,
    name: "Eletrónicos",
    icon: Smartphone,
    color: "bg-blue-100 text-blue-600",
    count: 1245,
  },
  {
    id: 2,
    name: "Computadores",
    icon: Laptop,
    color: "bg-purple-100 text-purple-600",
    count: 856,
  },
  {
    id: 3,
    name: "Casa & Cozinha",
    icon: HomeIcon,
    color: "bg-green-100 text-green-600",
    count: 623,
  },
  {
    id: 4,
    name: "Moda",
    icon: Shirt,
    color: "bg-pink-100 text-pink-600",
    count: 934,
  },
  {
    id: 5,
    name: "Livros",
    icon: Book,
    color: "bg-yellow-100 text-yellow-600",
    count: 412,
  },
  {
    id: 6,
    name: "Jogos",
    icon: Gamepad,
    color: "bg-red-100 text-red-600",
    count: 278,
  },
  {
    id: 7,
    name: "Fotografia",
    icon: Camera,
    color: "bg-indigo-100 text-indigo-600",
    count: 156,
  },
  {
    id: 8,
    name: "Automóvel",
    icon: Car,
    color: "bg-gray-100 text-gray-600",
    count: 89,
  },
];

// Mock data for features (mantido)
const features = [
  {
    id: 1,
    icon: Truck,
    title: "Entrega Rápida",
    description: "Receba seus produtos em 1-3 dias úteis em todo o país.",
  },
  {
    id: 2,
    icon: Shield,
    title: "Pagamento Seguro",
    description: "Transações seguras com múltiplos métodos de pagamento.",
  },
  {
    id: 3,
    icon: Headphones,
    title: "Suporte 24/7",
    description: "Equipe de suporte disponível para ajudar em qualquer dúvida.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites } = useFavorites();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // States for data fetching
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);
  
  // Mobile swipe navigation
  const [activeSection, setActiveSection] = useState(0);
  const sections = ["products", "offers", "stores"];
  const sectionRefs = {
    products: useRef(null),
    offers: useRef(null),
    stores: useRef(null)
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Featured Products (used for Products section)
      try {
        setLoadingProducts(true);
        const featuredProducts = await getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (e) {
        console.error("Failed to fetch featured products:", e);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }

      // Fetch Offers (simulated by fetching products and filtering/modifying)
      try {
        setLoadingOffers(true);
        const allProducts = await searchProducts("", undefined, undefined, 4); // Get highly rated products
        // Simulate discount for offers
        const simulatedOffers = allProducts.slice(0, 4).map(p => ({
          ...p,
          originalPrice: p.price * 1.25, // 25% discount simulation
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

      // Fetch Featured Stores
      try {
        setLoadingStores(true);
        const featuredStores = await getFeaturedStores();
        setStores(featuredStores);
      } catch (e) {
        console.error("Failed to fetch featured stores:", e);
        setStores([]);
      } finally {
        setLoadingStores(false);
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

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleAddToFavorites = (product) => {
    toast.success(`${product.title} adicionado aos favoritos!`);
  };

  // Mobile swipe navigation handlers
  const handleTouchStart = (e, section) => {
    // Store touch start position
    sectionRefs[section].current.startX = e.touches[0].clientX;
  };

  const handleTouchMove = (e, section) => {
    if (!sectionRefs[section].current.startX) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = sectionRefs[section].current.startX - currentX;
    
    // Only swipe horizontally
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - go to next section
        setActiveSection(prev => Math.min(prev + 1, sections.length - 1));
      } else {
        // Swipe right - go to previous section
        setActiveSection(prev => Math.max(prev - 1, 0));
      }
      
      // Reset touch start position
      sectionRefs[section].current.startX = null;
    }
  };

  // Funções para navegar entre páginas
  const goToPreviousPage = () => {
    // Navegar para a página anterior (conta -> favoritos -> ofertas -> categorias -> home)
    const currentPageIndex = 0; // Home é a primeira página
    if (currentPageIndex > 0) {
      const previousPage = ['account', 'favorites', 'offers', 'categories', 'home'][currentPageIndex - 1];
      navigate(`/${previousPage}`);
    }
  };

  const goToNextPage = () => {
    // Navegar para a próxima página (home -> categorias -> ofertas -> favoritos -> conta)
    const currentPageIndex = 0; // Home é a primeira página
    if (currentPageIndex < 4) {
      const nextPage = ['home', 'categories', 'offers', 'favorites', 'account'][currentPageIndex + 1];
      navigate(`/${nextPage}`);
    }
  };

  return (
    <SwipeablePage currentPage="home">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-6"
              >
                <img src={logo} alt="Lumi Logo" className="h-24 w-auto" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Encontre o Melhor Preço em Moçambique
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-blue-100 max-w-2xl mx-auto"
              >
                Compre com segurança, receba rápido e economize mais com milhares de produtos
              </motion.p>
            </div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Buscar produtos, lojas ou marcas..."
                      className="w-full px-6 py-4 text-gray-900 focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSearch(!showSearch)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Filter className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 flex items-center gap-2 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                    <span>Buscar</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Banner Carousel with swipe priority */}
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <BannerCarousel 
              banners={banners} 
              onSwipeLeft={goToNextPage}
              onSwipeRight={goToPreviousPage}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-neon-blue transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.icon === Truck ? 'bg-blue-100 text-blue-600' : feature.icon === Shield ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="py-12 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Categorias Populares</h2>
              <button
                onClick={() => navigate("/categories")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todas
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 cursor-pointer hover:shadow-neon-blue transition-shadow"
                  onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${category.color}`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} produtos</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation for Sections */}
        <div className="md:hidden sticky top-16 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveSection(0)}
              className={`flex-1 py-3 text-center font-medium ${
                activeSection === 0 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setActiveSection(1)}
              className={`flex-1 py-3 text-center font-medium ${
                activeSection === 1 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Ofertas
            </button>
            <button
              onClick={() => setActiveSection(2)}
              className={`flex-1 py-3 text-center font-medium ${
                activeSection === 2 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Lojas
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div 
          id="products-section"
          ref={sectionRefs.products}
          className={`py-12 px-4 ${activeSection !== 0 ? 'hidden md:block' : ''}`}
          onTouchStart={(e) => handleTouchStart(e, "products")}
          onTouchMove={(e) => handleTouchMove(e, "products")}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Produtos em Destaque</h2>
              <button
                onClick={() => navigate("/products")}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum produto em destaque encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-neon-blue transition-shadow overflow-hidden"
                  >
                    <div className="relative">
                      {/* Tornando a imagem clicável para a página de vendas */}
                      <div 
                        className="cursor-pointer"
                        onClick={() => navigate(`/sales/${product.id}`)}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </div>
                      )}
                      <button
                        onClick={() => handleAddToFavorites(product)}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:shadow-neon-blue transition-shadow"
                      >
                        <HeartIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviewCount})</span>
                        {product.shop.isVerified && (
                          <Badge variant="secondary" className="text-xs">✓</Badge>
                        )}
                      </div>
                      {/* Tornando o título clicável para a página de vendas */}
                      <h3 
                        className="font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => navigate(`/sales/${product.id}`)}
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-blue-600">
                            MT {product.price.toLocaleString('pt-MZ')}
                          </p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-sm text-gray-500 line-through">
                              MT {product.originalPrice.toLocaleString('pt-MZ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{product.timeDelivery}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Nome da loja clicável */}
                        <div 
                          className="flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => navigate(`/store/${product.shop.id}`)}
                        >
                          <Store className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-500">{product.shop.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            title="Adicionar ao carrinho"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Offers Section */}
        <div 
          id="offers-section"
          ref={sectionRefs.offers}
          className={`py-12 px-4 bg-white dark:bg-gray-800 ${activeSection !== 1 ? 'hidden md:block' : ''}`}
          onTouchStart={(e) => handleTouchStart(e, "offers")}
          onTouchMove={(e) => handleTouchMove(e, "offers")}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Ofertas Especiais</h2>
              <button
                onClick={() => navigate("/offers")}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                Ver todas <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {loadingOffers ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma oferta encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl shadow-sm hover:shadow-neon-blue transition-shadow overflow-hidden border border-red-200 dark:border-red-800"
                  >
                    <div className="relative">
                      {/* Tornando a imagem clicável para a página de vendas */}
                      <div 
                        className="cursor-pointer"
                        onClick={() => navigate(`/sales/${offer.id}`)}
                      >
                        <img
                          src={offer.images[0]}
                          alt={offer.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        {offer.discount}% OFF
                      </div>
                      <button
                        onClick={() => handleAddToFavorites(offer)}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:shadow-neon-blue transition-shadow"
                      >
                        <HeartIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{offer.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({offer.reviewCount})</span>
                        {offer.shop.isVerified && (
                          <Badge variant="secondary" className="text-xs">✓</Badge>
                        )}
                      </div>
                      {/* Tornando o título clicável para a página de vendas */}
                      <h3 
                        className="font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => navigate(`/sales/${offer.id}`)}
                      >
                        {offer.title}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-red-600">
                            MT {offer.price.toLocaleString('pt-MZ')}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            MT {offer.originalPrice.toLocaleString('pt-MZ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{offer.timeDelivery}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Nome da loja clicável */}
                        <div 
                          className="flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => navigate(`/store/${offer.shop.id}`)}
                        >
                          <Store className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-500">{offer.shop.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(offer)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="Adicionar ao carrinho"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stores Section */}
        <div 
          id="stores-section"
          ref={sectionRefs.stores}
          className={`py-12 px-4 ${activeSection !== 2 ? 'hidden md:block' : ''}`}
          onTouchStart={(e) => handleTouchStart(e, "stores")}
          onTouchMove={(e) => handleTouchMove(e, "stores")}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Lojas Destacadas</h2>
              <button
                onClick={() => navigate("/stores")}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                Ver todas <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {loadingStores ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma loja destacada encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stores.map((store) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-neon-blue transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={store.logo_url || "/placeholder.svg"}
                          alt={store.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          loading="lazy"
                        />
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {store.name}
                            {store.is_verified && (
                              <Badge variant="secondary" className="text-xs">✓</Badge>
                            )}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{store.rating?.toFixed(1) || '0.0'}</span>
                            <span className="text-sm text-gray-500">({store.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{store.products_count} produtos</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {/* Categories are mocked/removed here */}
                      </div>
                      <button
                        onClick={() => navigate(`/store/${store.id}`)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ver Loja
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Section Navigation Arrows */}
        <div className="md:hidden fixed bottom-20 right-4 flex gap-2 z-30">
          <button
            onClick={() => setActiveSection(prev => Math.max(prev - 1, 0))}
            disabled={activeSection === 0}
            className={`p-2 rounded-full shadow-lg ${
              activeSection === 0 
                ? "bg-gray-300 text-gray-500" 
                : "bg-blue-600 text-white"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActiveSection(prev => Math.min(prev + 1, sections.length - 1))}
            disabled={activeSection === sections.length - 1}
            className={`p-2 rounded-full shadow-lg ${
              activeSection === sections.length - 1 
                ? "bg-gray-300 text-gray-500" 
                : "bg-blue-600 text-white"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Comece a Economizar Hoje Mesmo!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-xl mb-8 text-blue-100"
            >
              Junte-se a milhares de clientes satisfeitos e descubra os melhores preços
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Criar Conta
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Entrar
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </SwipeablePage>
  );
}