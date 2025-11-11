"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import { getSimilarProducts } from "@/api/products";
import ProductCard from "./ProductCard";
import { Skeleton } from "./ui/skeleton";

interface RelatedProductsSectionProps {
  currentProductId: string;
  currentProductCategory: string;
}

export default function RelatedProductsSection({ 
  currentProductId, 
  currentProductCategory 
}: RelatedProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Define quantos itens são visíveis por breakpoint
  const itemsPerView = 4; 

  const fetchRelatedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getSimilarProducts(currentProductCategory, currentProductId);
      setProducts(fetchedProducts);
    } catch (err) {
      setError("Falha ao carregar produtos relacionados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentProductCategory, currentProductId]);

  useEffect(() => {
    if (currentProductCategory) {
      fetchRelatedProducts();
    }
  }, [fetchRelatedProducts, currentProductCategory]);

  const nextSlide = () => {
    if (products.length > itemsPerView) {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }
  };

  const prevSlide = () => {
    if (products.length > itemsPerView) {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  const getVisibleProducts = () => {
    if (products.length <= itemsPerView) {
      return products;
    }
    const visible = [];
    for (let i = 0; i < itemsPerView; i++) {
      visible.push(products[(currentIndex + i) % products.length]);
    }
    return visible;
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="font-title text-2xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
          Produtos Relacionados
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500 flex items-center justify-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }
  
  if (products.length === 0) {
    return null; // Não mostra a seção se não houver produtos relacionados
  }

  const visibleProducts = getVisibleProducts();

  return (
    <div className="py-8">
      <h2 className="font-title text-2xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
        Produtos Relacionados
      </h2>
      
      <div className="relative">
        {/* Navigation Buttons (Desktop only) */}
        {products.length > itemsPerView && (
          <>
            <Button
              onClick={prevSlide}
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hidden lg:flex shadow-lg"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hidden lg:flex shadow-lg"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </>
        )}

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 transition-transform duration-300 ease-in-out"
            // Usamos o grid para layout responsivo e o estado currentIndex para simular o carrossel
            // Em um carrossel real, usaríamos Embla ou Swiper, mas para manter a simplicidade, 
            // vamos apenas mostrar os produtos em um grid e usar os botões para mudar o índice inicial.
          >
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Dots Indicator (Mobile/Tablet) */}
        {products.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-6 lg:hidden">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-blue-600 w-6" : "bg-gray-300"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}