"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Trash2, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

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

  const removeFavorite = (id: number) => {
    setFavoritesList(prev => prev.filter(item => item.id !== id));
  };

  const handleBuy = (product: Product) => {
    addToCart(product, 1);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Favoritos</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
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
            <div className="bg-blue-50 rounded-lg p-4 mb-6 dark:bg-blue-900/50">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                {favoritesList.length} {favoritesList.length === 1 ? 'Produto' : 'Produtos'} nos seus favoritos
              </h3>
            </div>

            {/* Favorites Grid */}
            <div className="space-y-4">
              {favoritesList.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <Link to={`/product/${item.id}`} className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </Link>
                      
                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <Link to={`/product/${item.id}`} className="flex-1">
                            <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                              {item.title}
                            </h3>
                          </Link>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFavorite(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <Link to={`/store/${item.shop.id}`} className="text-sm text-gray-600 hover:text-blue-600 hover:underline dark:text-gray-400 dark:hover:text-blue-400">
                          {item.shop.name}
                        </Link>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1 text-gray-900 dark:text-white">{item.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-blue-600">
                              MT {item.price.toLocaleString('pt-MZ')}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                MT {item.originalPrice.toLocaleString('pt-MZ')}
                              </span>
                            )}
                          </div>
                          <Button size="sm" onClick={() => handleBuy(item)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Comprar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}