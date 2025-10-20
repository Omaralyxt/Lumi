"use client";

import { useState } from "react";
import { Star, Clock, Zap, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const offers = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    originalPrice: 15000,
    currentPrice: 12500,
    discount: 17,
    rating: 4.5,
    sold: 23,
    timeLeft: "2h 30m",
    image: "/placeholder.svg",
    shop: "TechStore MZ",
  },
  {
    id: 2,
    title: "Tênis Esportivo Nike Air Max",
    originalPrice: 3500,
    currentPrice: 2500,
    discount: 29,
    rating: 4.2,
    sold: 15,
    timeLeft: "5h 15m",
    image: "/placeholder.svg",
    shop: "ModaExpress",
  },
  {
    id: 3,
    title: "Panela de Pressão Inox",
    originalPrice: 2200,
    currentPrice: 1800,
    discount: 18,
    rating: 4.8,
    sold: 31,
    timeLeft: "1d 3h",
    image: "/placeholder.svg",
    shop: "CozinhaFeliz",
  },
  {
    id: 4,
    title: "Fone de Ouvido Bluetooth",
    originalPrice: 2800,
    currentPrice: 1999,
    discount: 29,
    rating: 4.3,
    sold: 42,
    timeLeft: "3h 45m",
    image: "/placeholder.svg",
    shop: "TechStore MZ",
  },
  {
    id: 5,
    title: "Smartwatch Xiaomi Mi Band",
    originalPrice: 1800,
    currentPrice: 1299,
    discount: 28,
    rating: 4.6,
    sold: 67,
    timeLeft: "6h 20m",
    image: "/placeholder.svg",
    shop: "TechStore MZ",
  },
  {
    id: 6,
    title: "Câmera Digital Canon",
    originalPrice: 25000,
    currentPrice: 19999,
    discount: 20,
    rating: 4.7,
    sold: 8,
    timeLeft: "12h 30m",
    image: "/placeholder.svg",
    shop: "FotografiaPro",
  },
];

export default function OffersPage() {
  const [sortBy, setSortBy] = useState<"discount" | "time" | "rating">("discount");

  const sortedOffers = [...offers].sort((a, b) => {
    switch (sortBy) {
      case "discount":
        return b.discount - a.discount;
      case "time":
        return a.timeLeft.localeCompare(b.timeLeft);
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Ofertas do Dia</h1>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="flex space-x-2 mt-3">
            <Button
              variant={sortBy === "discount" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("discount")}
              className="text-xs"
            >
              <Percent className="h-3 w-3 mr-1" />
              Maior Desconto
            </Button>
            <Button
              variant={sortBy === "time" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("time")}
              className="text-xs"
            >
              <Clock className="h-3 w-3 mr-1" />
              Terminando em
            </Button>
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("rating")}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Melhor Avaliação
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Flash Sale Banner */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Venda Relâmpago
              </h2>
              <p className="text-sm opacity-90">Ofertas por tempo limitado!</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Termina em</p>
              <p className="font-bold">23:59:59</p>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="relative mb-4">
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    -{offer.discount}%
                  </Badge>
                  <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {offer.timeLeft}
                  </Badge>
                </div>
                
                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{offer.title}</h3>
                  <p className="text-sm text-gray-600">{offer.shop}</p>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{offer.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{offer.sold} vendidos</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-blue-600">
                        MT {offer.currentPrice.toLocaleString('pt-MZ')}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        MT {offer.originalPrice.toLocaleString('pt-MZ')}
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
    </div>
  );
}