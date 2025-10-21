"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Trash2, Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import FavoriteButton from "@/components/FavoriteButton";
import { toast } from "sonner";

// Dados mockados com estrutura completa para compatibilidade com o carrinho
const initialFavorites: Product[] = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    price: 12500,
    originalPrice: 15000,
    rating: 4.5,
    shop: { id: 1, name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
    images: ["/placeholder.svg"],
    stock: 10,
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    reviewCount: 128,
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 2,
    title: "Tênis Esportivo Nike Air Max",
    price: 2500,
    originalPrice: 3500,
    rating: 4.2,
    shop: { id: 2, name: "ModaExpress", rating: 4.5, reviewCount: 234, isVerified: true },
    images: ["/placeholder.svg"],
    stock: 15,
    category: "Moda",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 100, eta: "1-2 dias" },
    reviews: [],
    options: [],
    reviewCount: 89,
    timeDelivery: "2-3 dias úteis",
  },
  {
    id: 3,
    title: "Panela de Pressão Inox",
    price: 1800,
    originalPrice: 2200,
    rating: 4.8,
    shop: { id: 3, name: "CozinhaFeliz", rating: 4.9, reviewCount: 412, isVerified: true },
    images: ["/placeholder.svg"],
    stock: 5,
    category: "Casa & Cozinha",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 80, eta: "2-3 dias" },
    reviews: [],
    options: [],
    reviewCount: 156,
    timeDelivery: "3-5 dias úteis",
  },
];

export default function FavoritesPage() {
  const [favoritesList, setFavoritesList] = useState(initialFavorites);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Simulação de remoção de favorito (em um app real, isso usaria o FavoriteButton ou uma API)
  const removeFavorite = (id: number) => {
    setFavoritesList(prev => prev.filter(item => item.id !== id));
    toast.info("Produto removido dos favoritos.");
  };

  const handleBuy = (product: Product) => {
    addToCart(product, 1);
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-body text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-title text-4xl text-gray-900 dark:text-gray-100 tracking-wide">
            Meus Favoritos
          </h1>
          <Button variant="ghost" size="sm" onClick={() => navigate('/account')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {favoritesList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 dark:text-white">Nenhum favorito ainda</h2>
            <p className="text-gray-600 mb-4 dark:text-gray-400">Salve seus produtos favoritos aqui para acessá-los facilmente</p>
            <Button asChild>
              <Link to="/">Explorar Produtos</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="bg-blue-50/50 rounded-xl p-4 mb-6 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200 dark:border-blue-900">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                {favoritesList.length} {favoritesList.length === 1 ? 'Produto' : 'Produtos'} nos seus favoritos
              </h3>
            </div>

            {/* Favorites List (using the new card style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoritesList.map((item) => (
                <div 
                  key={item.id} 
                  className="relative group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-transparent hover:border-[rgba(255,0,0,0.6)] shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.4)] transition-all duration-300 p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>
                  
                  {/* Product Info */}
                  <div className="flex-1 space-y-1 w-full">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-body font-semibold text-gray-900 line-clamp-2 hover:text-blue-500 dark:text-white dark:hover:text-blue-400">
                        {item.title}
                      </h3>
                    </Link>
                    
                    <Link to={`/store/${item.shop.id}`}>
                      <p className="text-sm text-gray-500 hover:text-blue-500 hover:underline dark:text-gray-400 dark:hover:text-blue-400">
                        {item.shop.name}
                      </p>
                    </Link>
                    
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.rating.toFixed(1)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xl font-bold text-blue-600">
                          MT {item.price.toLocaleString('pt-MZ')}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            MT {item.originalPrice.toLocaleString('pt-MZ')}
                          </span>
                        )}
                      </div>
                      <button 
                        className="btn btn-primary flex items-center gap-2 text-sm"
                        onClick={() => handleBuy(item)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Comprar
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-2 right-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)] transition text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}