"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Bell, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

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
    return null; // Não renderiza se não houver categorias
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

// Componente de Produto (Placeholder)
const ProductCard = ({ product }: { product: { id: number, name: string, price: number, imageUrl: string } }) => (
  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
    <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
    <CardContent className="p-3">
      <h3 className="text-sm font-semibold truncate">{product.name}</h3>
      <p className="text-lg font-bold text-blue-600 mt-1">MZN {product.price.toFixed(2)}</p>
    </CardContent>
  </Card>
);

// Componente de Banner (Placeholder)
const Banner = () => (
  <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-md mb-8">
    <h1 className="text-4xl font-title font-extrabold text-blue-800 dark:text-blue-200 mb-2">Lumi Market</h1>
    <p className="text-blue-600 dark:text-blue-300">Descubra produtos incríveis de vendedores locais.</p>
    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Compre Agora</Button>
  </div>
);

// Dados de produtos de exemplo (Placeholder)
const featuredProducts = [
  { id: 1, name: "T-shirt Algodão Premium", price: 450.00, imageUrl: "https://via.placeholder.com/300x200?text=Produto+1" },
  { id: 2, name: "Calças Jeans Slim Fit", price: 1200.00, imageUrl: "https://via.placeholder.com/300x200?text=Produto+2" },
  { id: 3, name: "Sapatilhas Desportivas", price: 1800.00, imageUrl: "https://via.placeholder.com/300x200?text=Produto+3" },
  { id: 4, name: "Relógio Inteligente", price: 3500.00, imageUrl: "https://via.placeholder.com/300x200?text=Produto+4" },
];

// Componente Principal da Página
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Fixo */}
      <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 z-40 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-title font-bold text-blue-600">Lumi</h1>
          <div className="flex space-x-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/search")}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/notifications")}>
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {/* Banner */}
        <Banner />

        {/* Seção de Categorias */}
        <CategorySection navigate={navigate} />

        {/* Seção de Produtos em Destaque */}
        <div className="py-8">
          <h2 className="font-title text-3xl font-bold mb-6 tracking-wide text-gray-900 dark:text-white">
            Produtos em Destaque
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}