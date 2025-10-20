"use client";

import { useState } from "react";
import { Search, Package, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: 1, name: "Eletrónicos", icon: Package },
  { id: 2, name: "Moda", icon: ShoppingBag },
  { id: 3, name: "Casa & Cozinha", icon: Package },
  { id: 4, name: "Saúde & Beleza", icon: Package },
  { id: 5, name: "Desporto", icon: Package },
  { id: 6, name: "Livros", icon: Package },
];

const featuredProducts = [
  {
    id: 1,
    title: "Smartphone Android",
    price: 12500,
    originalPrice: 15000,
    image: "/placeholder.svg",
    rating: 4.5,
    shop: "TechStore MZ",
    sold: 23,
  },
  {
    id: 2,
    title: "Tênis Esportivo",
    price: 2500,
    originalPrice: 3500,
    image: "/placeholder.svg",
    rating: 4.2,
    shop: "ModaExpress",
    sold: 15,
  },
  {
    id: 3,
    title: "Panela de Pressão",
    price: 1800,
    originalPrice: 2200,
    image: "/placeholder.svg",
    rating: 4.8,
    shop: "CozinhaFeliz",
    sold: 31,
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ShoppingBag className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar produtos, lojas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Categorias</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-center text-gray-700">{category.name}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Ofertas do Dia</h2>
            <Button variant="outline" size="sm">Ver todos</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {/* Product Image */}
                  <div className="relative mb-4">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-gray-600">{product.shop}</p>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{product.sold} vendidos</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-blue-600">
                          MT {product.price.toLocaleString('pt-MZ')}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          MT {product.originalPrice.toLocaleString('pt-MZ')}
                        </span>
                      </div>
                      <Button size="sm">Comprar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Comece a vender hoje!</h3>
          <p className="text-gray-600 mb-4">
            Crie sua loja online e alcance milhares de clientes em Moçambique.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Criar Loja Gratuita
          </Button>
        </div>
      </div>
    </div>
  );
}