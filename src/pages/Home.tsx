"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid3X3, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import HomeBannerScroll from "@/components/HomeBannerScroll"; // Importar o novo componente
import ProductSection from "@/components/ProductSection";
import { getFeaturedProducts } from "@/api/products";

// Componente de Item de Categoria
const CategoryItem = ({ name, navigate }: { name: string, navigate: (path: string) => void }) => (
  <Card 
    className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors dark:hover:bg-gray-800"
    onClick={() => navigate(`/category/${name.toLowerCase().replace(/\s+/g, '-')}`)}
  >
    <Grid3X3 className="h-8 w-8 text-blue-600 mb-2" />
    <p className="text-sm font-medium text-center">{name}</p>
  </Card>
);

// Componente de Seção de Categorias
const CategorySection = ({ navigate }: { navigate: (path: string) => void }) => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="font-title text-3xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
          Explorar Categorias
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="py-8 text-red-500">Erro ao carregar categorias: {error}</div>;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="font-title text-3xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
        Explorar Categorias
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryItem 
            key={category.name} 
            name={category.name} 
            navigate={navigate} 
          />
        ))}
      </div>
    </div>
  );
};

// Componente Principal da Página
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <main className="max-w-md mx-auto p-4">
        {/* Banner Scroll */}
        <div className="mb-8">
          <HomeBannerScroll />
        </div>

        {/* Seção de Categorias */}
        <CategorySection navigate={navigate} />

        {/* Seção de Produtos em Destaque (Dynamic) */}
        <ProductSection 
          title="Produtos em Destaque" 
          fetchFunction={getFeaturedProducts} 
          showStoreInfo={true}
        />
      </main>
    </div>
  );
}