"use client";

import { useState, useEffect } from "react";
import { Clock, Zap, Percent, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/ProductGrid";
import { Link } from "react-router-dom";
import SwipeablePage from "@/components/SwipeablePage";
import { searchProducts } from "@/api/search";
import { Product } from "@/types/product";
import Loading from "@/components/Loading";

interface OfferProduct extends Product {
  discount: number;
  timeLeft: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"discount" | "time" | "rating">("discount");

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        // Buscar todos os produtos e simular que são ofertas
        const allProducts = await searchProducts("", undefined, undefined, 0); 
        
        // Simular desconto e tempo restante
        const simulatedOffers: OfferProduct[] = allProducts.slice(0, 8).map(p => {
          const discount = Math.floor(Math.random() * 30) + 10; // 10% a 40%
          const originalPrice = p.price / (1 - discount / 100);
          
          return {
            ...p,
            originalPrice: parseFloat(originalPrice.toFixed(2)),
            discount: discount,
            timeLeft: `${Math.floor(Math.random() * 23) + 1}h ${Math.floor(Math.random() * 59) + 1}m`,
          };
        });
        
        setOffers(simulatedOffers);
      } catch (e) {
        console.error("Failed to fetch offers:", e);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const sortedOffers = [...offers].sort((a, b) => {
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

  if (loading) {
    return <Loading />;
  }

  return (
    <SwipeablePage currentPage="offers">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-body text-gray-900 dark:text-gray-100 transition-colors duration-500">
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
          {sortedOffers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma oferta disponível no momento.</p>
            </div>
          ) : (
            <ProductGrid products={sortedOffers} showStoreInfo={true} />
          )}
        </div>
      </div>
    </SwipeablePage>
  );
}