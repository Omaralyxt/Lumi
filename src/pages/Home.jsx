"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/images/logo.svg";
import BannerCarousel from "@/components/BannerCarousel";

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

// Mock data for categories
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

// Mock data for featured products
const initialProducts = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    price: 12500,
    originalPrice: 15000,
    images: ["/placeholder.svg"],
    shop: { name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
    quantity: 1,
    stock: 15,
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.5,
    reviewCount: 128,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 2,
    title: "Fone de Ouvido Bluetooth Sony WH-1000XM5",
    price: 18500,
    originalPrice: 22000,
    images: ["/placeholder.svg"],
    shop: { name: "AudioPro MZ", rating: 4.9, reviewCount: 189, isVerified: true },
    quantity: 1,
    stock: 8,
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.8,
    reviewCount: 67,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 3,
    title: "Notebook Dell Inspiron 15 3520",
    price: 28500,
    originalPrice: 32000,
    images: ["/placeholder.svg"],
    shop: { name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
    quantity: 1,
    stock: 5,
    category: "Computadores",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.6,
    reviewCount: 92,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 4,
    title: "Smartwatch Apple Watch Series 9",
    price: 22500,
    originalPrice: 25000,
    images: ["/placeholder.svg"],
    shop: { name: "Apple Store MZ", rating: 4.8, reviewCount: 267, isVerified: true },
    quantity: 1,
    stock: 12,
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.7,
    reviewCount: 145,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 5,
    title: "Câmera Canon EOS R6 Mark II",
    price: 45000,
    originalPrice: 52000,
    images: ["/placeholder.svg"],
    shop: { name: "FotoPro MZ", rating: 4.9, reviewCount: 124, isVerified: true },
    quantity: 1,
    stock: 3,
    category: "Fotografia",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.9,
    reviewCount: 56,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 6,
    title: "Console PlayStation 5",
    price: 32000,
    originalPrice: 35000,
    images: ["/placeholder.svg"],
    shop: { name: "GameStore MZ", rating: 4.8, reviewCount: 210, isVerified: true },
    quantity: 1,
    stock: 7,
    category: "Jogos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.8,
    reviewCount: 89,
    timeDelivery: "2-5 dias úteis",
  },
];

// Mock data for offers
const initialOffers = [
  {
    id: 1,
    title: "Smartphone Xiaomi Redmi Note 13 Pro",
    discount: 25,
    price: 11250,
    originalPrice: 15000,
    images: ["/placeholder.svg"],
    shop: { name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
    quantity: 1,
    stock: 20,
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.4,
    reviewCount: 89,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 2,
    title: "Fone de Ouvido Gamer HyperX Cloud Stinger",
    discount: 30,
    price: 5250,
    originalPrice: 7500,
    images: ["/placeholder.svg"],
    shop: { name: "GamingPro MZ", rating: 4.6, reviewCount: 156, isVerified: true },
    quantity: 1,
    stock: 15,
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.5,
    reviewCount: 67,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 3,
    title: "Smart TV Samsung 50\" 4K Ultra HD",
    discount: 20,
    price: 18500,
    originalPrice: 23125,
    images: ["/placeholder.svg"],
    shop: { name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
    quantity: 1,
    stock: 8,
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.6,
    reviewCount: 112,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 4,
    title: "Tablet Samsung Galaxy Tab S8",
    discount: 15,
    price: 17000,
    originalPrice: 20000,
    images: ["/placeholder.svg"],
    shop: { name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
    quantity: 1,
    stock: 12,
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    rating: 4.5,
    reviewCount: 78,
    timeDelivery: "2-5 dias úteis",
  },
];

// Mock data for stores
const initialStores = [
  {
    id: 1,
    name: "TechStore MZ",
    logo: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 342,
    isVerified: true,
    productsCount: 1245,
    categories: ["Eletrónicos", "Computadores", "Acessórios"],
  },
  {
    id: 2,
    name: "Fashion Hub",
    logo: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 267,
    isVerified: true,
    productsCount: 892,
    categories: ["Moda", "Acessórios", "Beleza"],
  },
  {
    id: 3,
    name: "Home & Garden",
    logo: "/placeholder.svg",
    rating: 4.6,
    reviewCount: 189,
    isVerified: true,
    productsCount: 634,
    categories: ["Casa & Cozinha", "Decoração", "Jardinagem"],
  },
  {
    id: 4,
    name: "Sports World",
    logo: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 145,
    isVerified: true,
    productsCount: 423,
    categories: ["Desporto", "Fitness", "Outdoor"],
  },
  {
    id: 5,
    name: "Book Lovers",
    logo: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 210,
    isVerified: true,
    productsCount: 567,
    categories: ["Livros", "Educação", "Papelaria"],
  },
  {
    id: 6,
    name: "Auto Parts MZ",
    logo: "/placeholder.svg",
    rating: 4.4,
    reviewCount: 98,
    isVerified: true,
    productsCount: 321,
    categories: ["Automóvel", "Peças", "Acessórios"],
  },
];

// Mock data for features
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // States for infinite scroll
  const [products, setProducts] = useState(initialProducts);
  const [offers, setOffers] = useState(initialOffers);
  const [stores, setStores] = useState(initialStores);
  const [productsPage, setProductsPage] = useState(1);
  const [offersPage, setOffersPage] = useState(1);
  const [storesPage, setStoresPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreOffers, setHasMoreOffers] = useState(true);
  const [hasMoreStores, setHasMoreStores] = useState(true);

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

  // Simulate loading more products
  const loadMoreProducts = useCallback(() => {
    if (loadingProducts || !hasMoreProducts) return;
    
    setLoadingProducts(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call with pagination
      const newProducts = initialProducts.map(product => ({
        ...product,
        id: product.id + productsPage * 100 // Just to make IDs unique
      }));
      
      setProducts(prev => [...prev, ...newProducts]);
      setProductsPage(prev => prev + 1);
      
      // Simulate reaching the end after 3 pages
      if (productsPage >= 3) {
        setHasMoreProducts(false);
      }
      
      setLoadingProducts(false);
    }, 1000);
  }, [loadingProducts, hasMoreProducts, productsPage]);

  // Simulate loading more offers
  const loadMoreOffers = useCallback(() => {
    if (loadingOffers || !hasMoreOffers) return;
    
    setLoadingOffers(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call with pagination
      const newOffers = initialOffers.map(offer => ({
        ...offer,
        id: offer.id + offersPage * 100 // Just to make IDs unique
      }));
      
      setOffers(prev => [...prev, ...newOffers]);
      setOffersPage(prev => prev + 1);
      
      // Simulate reaching the end after 3 pages
      if (offersPage >= 3) {
        setHasMoreOffers(false);
      }
      
      setLoadingOffers(false);
    }, 1000);
  }, [loadingOffers, hasMoreOffers, offersPage]);

  // Simulate loading more stores
  const loadMoreStores = useCallback(() => {
    if (loadingStores || !hasMoreStores) return;
    
    setLoadingStores(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call with pagination
      const newStores = initialStores.map(store => ({
        ...store,
        id: store.id + storesPage * 100 // Just to make IDs unique
      }));
      
      setStores(prev => [...prev, ...newStores]);
      setStoresPage(prev => prev + 1);
      
      // Simulate reaching the end after 3 pages
      if (storesPage >= 3) {
        setHasMoreStores(false);
      }
      
      setLoadingStores(false);
    }, 1000);
  }, [loadingStores, hasMoreStores, storesPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.id;
            
            if (section === "products-section" && hasMoreProducts) {
              loadMoreProducts();
            } else if (section === "offers-section" && hasMoreOffers) {
              loadMoreOffers();
            } else if (section === "stores-section" && hasMoreStores) {
              loadMoreStores();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const productsSection = document.getElementById("products-section");
    const offersSection = document.getElementById("offers-section");
    const storesSection = document.getElementById("stores-section");
    
    if (productsSection) observer.observe(productsSection);
    if (offersSection) observer.observe(offersSection);
    if (storesSection) observer.observe(storesSection);

    return () => {
      if (productsSection) observer.unobserve(productsSection);
      if (offersSection) observer.unobserve(offersSection);
      if (storesSection) observer.unobserve(storesSection);
    };
  }, [loadMoreProducts, loadMoreOffers, loadMoreStores, hasMoreProducts, hasMoreOffers, hasMoreStores]);

  return (
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

      {/* Banner Carousel */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <BannerCarousel banners={banners} />
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

      {/* Products Section with Infinite Scroll */}
      <div className="py-12 px-4" id="products-section">
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
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
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
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
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
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-gray-500" />
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

          {/* Loading indicator for products */}
          {loadingProducts && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
          )}

          {/* End of products message */}
          {!hasMoreProducts && (
            <div className="text-center py-8 text-gray-500">
              <p>Não há mais produtos para carregar</p>
            </div>
          )}
        </div>
      </div>

      {/* Offers Section with Infinite Scroll */}
      <div className="py-12 px-4 bg-white dark:bg-gray-800" id="offers-section">
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
                  <img
                    src={offer.images[0]}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
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
                  <h3 className="font-semibold mb-2 line-clamp-2">{offer.title}</h3>
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
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-gray-500" />
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

          {/* Loading indicator for offers */}
          {loadingOffers && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
          )}

          {/* End of offers message */}
          {!hasMoreOffers && (
            <div className="text-center py-8 text-gray-500">
              <p>Não há mais ofertas para carregar</p>
            </div>
          )}
        </div>
      </div>

      {/* Stores Section with Infinite Scroll */}
      <div className="py-12 px-4" id="stores-section">
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
                      src={store.logo}
                      alt={store.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {store.name}
                        {store.isVerified && (
                          <Badge variant="secondary" className="text-xs">✓</Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{store.rating}</span>
                        <span className="text-sm text-gray-500">({store.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{store.productsCount} produtos</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {store.categories.map((category, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
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

          {/* Loading indicator for stores */}
          {loadingStores && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
          )}

          {/* End of stores message */}
          {!hasMoreStores && (
            <div className="text-center py-8 text-gray-500">
              <p>Não há mais lojas para carregar</p>
            </div>
          )}
        </div>
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
  );
}