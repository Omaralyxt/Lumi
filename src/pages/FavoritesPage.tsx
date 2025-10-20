"use client";

import { useState } from "react";
import { Star, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const favorites = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    price: 12500,
    originalPrice: 15000,
    rating: 4.5,
    shop: "TechStore MZ",
    image: "/placeholder.svg",
    isFavorite: true,
  },
  {
    id: 2,
    title: "Tênis Esportivo Nike Air Max",
    price: 2500,
    originalPrice: 3500,
    rating: 4.2,
    shop: "ModaExpress",
    image: "/placeholder.svg",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Panela de Pressão Inox",
    price: 1800,
    originalPrice: 2200,
    rating: 4.8,
    shop: "CozinhaFeliz",
    image: "/placeholder.svg",
    isFavorite: true,
  },
];

export default function FavoritesPage() {
  const [favoritesList, setFavoritesList] = useState(favorites);

  const toggleFavorite = (id: number) => {
    setFavoritesList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ).filter(item => item.isFavorite)
    );
  };

  const removeFavorite = (id: number) => {
    setFavoritesList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Favoritos</h1>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {favoritesList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Nenhum favorito ainda</h2>
            <p className="text-gray-600 mb-4">Salve seus produtos favoritos aqui para acessá-los facilmente</p>
            <Button>Explorar Produtos</Button>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {favoritesList.length} {favoritesList.length === 1 ? 'Produto' : 'Produtos'} favoritado{favoritesList.length === 1 ? '' : 's'}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Acompanhe seus produtos favoritos aqui
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Comprar Todos
                </Button>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="space-y-4">
              {favoritesList.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
                            {item.title}
                          </h3>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(item.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
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
                        
                        <p className="text-sm text-gray-600">{item.shop}</p>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{item.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-blue-600">
                              MT {item.price.toLocaleString('pt-MZ')}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              MT {item.originalPrice.toLocaleString('pt-MZ')}
                            </span>
                          </div>
                          <Button size="sm">Comprar</Button>
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