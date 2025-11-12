"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
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
  
  const fetchRelatedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Busca até 8 produtos similares
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

  return (
    <div className="py-8">
      <h2 className="font-title text-2xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
        Produtos Relacionados
      </h2>
      
      {/* Usando um grid simples para exibir os produtos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}