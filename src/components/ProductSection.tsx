"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";
import { getFeaturedProducts } from "@/api/products";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle } from "lucide-react";

interface ProductSectionProps {
  title: string;
  fetchFunction: () => Promise<Product[]>;
  showStoreInfo?: boolean;
}

export default function ProductSection({ title, fetchFunction, showStoreInfo = false }: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFunction();
        setProducts(data);
      } catch (err) {
        setError("Falha ao carregar produtos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchFunction]);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="font-title text-3xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-4">
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
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        <h2 className="font-title text-3xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
          {title}
        </h2>
        <p>Nenhum produto encontrado nesta seção.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="font-title text-3xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
        {title}
      </h2>
      <ProductGrid products={products} showStoreInfo={true} />
    </div>
  );
}