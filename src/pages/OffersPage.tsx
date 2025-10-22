"use client";

import { useState } from "react";
import { Clock, Zap, Percent, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/ProductGrid";
import { Link } from "react-router-dom";
import SwipeablePage from "@/components/SwipeablePage";

// Mock data adaptado para o tipo Product
const offers = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    originalPrice: 15000,
    price: 12500,
    rating: 4.5,
    reviewCount: 128,
    stock: 10,
    timeLeft: "2h 30m",
    images: ["/placeholder.svg"],
    shop: { id: 1, name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
    reviews: [],
    options: [],
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 2,
    title: "Tênis Esportivo Nike Air Max",
    originalPrice: 3500,
    price: 2500,
    rating: 4.2,
    reviewCount: 89,
    stock: 15,
    timeLeft: "5h 15m",
    images: ["/placeholder.svg"],
    shop: { id: 2, name: "ModaExpress", rating: 4.5, reviewCount: 234, isVerified: true },
    category: "Moda",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 100, eta: "1-2 dias" },
    reviews: [],
    options: [],
    timeDelivery: "2-3 dias úteis",
  },
  {
    id: 3,
    title: "Panela de Pressão Inox",
    originalPrice: 2200,
    price: 1800,
    rating: 4.8,
    reviewCount: 156,
    stock: 5,
    timeLeft: "1d 3h",
    images: ["/placeholder.svg"],
    shop: { id: 3, name: "CozinhaFeliz", rating: 4.9, reviewCount: 412, isVerified: true },
    category: "Casa & Cozinha",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 80, eta: "2-3 dias" },
    reviews: [],
    options: [],
    timeDelivery: "3-5 dias úteis",
  },
  {
    id: 4,
    title: "Fone de Ouvido Bluetooth",
    originalPrice: 2800,
    price: 1999,
    rating: 4.3,
    reviewCount: 67,
    stock: 12,
    timeLeft: "3h 45m",
    images: ["/placeholder.svg"],
    shop: { id: 1, name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
    category: "Eletrónicos",
    description: "",
    features: [],
    specifications: {},
    deliveryInfo: { city: "Maputo", fee: 120, eta: "1-2 dias" },
    reviews: [],
    options: [],
    timeDelivery: "2-4 dias úteis",
  },
];

export default function OffersPage() {
  const [sortBy, setSortBy] = useState<"discount" | "time" | "rating">("discount");

  const sortedOffers = [...offers].sort((a, b) => {
    // Cálculo de desconto para ordenação
    const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
    const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;

    switch (sortBy) {
      case "discount":
        return discountB - discountA;
      case "time":
        // Simplesmente compara a string de tempo restante (não ideal, mas funciona para mock)
        return a.timeLeft.localeCompare(b.timeLeft);
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <SwipeablePage currentPage="offers">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-body text-gray-900 dark:text-gray-100 transition-colors duration-500">
        {/* Header (Removido, pois AppLayout já fornece o cabeçalho principal) */}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="font-title text-4xl text-gray-900 dark:text-gray-100 tracking-wide mb-6">
            Ofertas do Dia
          </h1>

          {/* Flash Sale Banner */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-title text-2xl flex items-center">
                  <Zap className="h-6 w-6 mr-2" />
                  Venda Relâmpago
                </h2>
                <p className="text-sm opacity-90 font-body">Ofertas por tempo limitado!</p>
              </div>
              <div className="text-right font-body">
                <p className="text-xs opacity-90">Termina em</p>
                <p className="font-bold text-lg">23:59:59</p>
              </div>
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={sortBy === "discount" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("discount")}
              className="text-xs flex-shrink-0"
            >
              <Percent className="h-3 w-3 mr-1" />
              Maior Desconto
            </Button>
            <Button
              variant={sortBy === "time" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("time")}
              className="text-xs flex-shrink-0"
            >
              <Clock className="h-3 w-3 mr-1" />
              Terminando em
            </Button>
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("rating")}
              className="text-xs flex-shrink-0"
            >
              <Clock className="h-3 w-3 mr-1" />
              Melhor Avaliação
            </Button>
          </div>

          {/* Offers Grid using ProductGrid */}
          <ProductGrid products={sortedOffers} showStoreInfo={true} />
        </div>
      </div>
    </SwipeablePage>
  );
}