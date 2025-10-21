"use client";

import { useState } from "react";
import { Package, Smartphone, Shirt, Home, Heart, Dumbbell, Book, Baby, Car, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Eletrónicos",
    icon: Smartphone,
    description: "Smartphones, tablets, acessórios",
    count: 1245,
    slug: "eletronicos",
  },
  {
    id: 2,
    name: "Moda",
    icon: Shirt,
    description: "Roupas, calçados, acessórios",
    count: 892,
    slug: "moda",
  },
  {
    id: 3,
    name: "Casa & Cozinha",
    icon: Home,
    description: "Móveis, eletrodomésticos, decoração",
    count: 567,
    slug: "casa-cozinha",
  },
  {
    id: 4,
    name: "Saúde & Beleza",
    icon: Heart,
    description: "Produtos de saúde e beleza",
    count: 423,
    slug: "saude-beleza",
  },
  {
    id: 5,
    name: "Desporto",
    icon: Dumbbell,
    description: "Equipamentos desportivos, roupas",
    count: 334,
    slug: "desporto",
  },
  {
    id: 6,
    name: "Livros",
    icon: Book,
    description: "Livros, e-books, materiais",
    count: 298,
    slug: "livros",
  },
  {
    id: 7,
    name: "Bebés & Crianças",
    icon: Baby,
    description: "Produtos para bebês e crianças",
    count: 267,
    slug: "bebes-criancas",
  },
  {
    id: 8,
    name: "Automóvel",
    icon: Car,
    description: "Peças, acessórios, serviços",
    count: 189,
    slug: "automovel",
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-body text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-title text-4xl text-gray-900 dark:text-gray-100 tracking-wide">
            Categorias
          </h1>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar categorias..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <Card
                  className="product-card-style cursor-pointer transition-all hover:shadow-md dark:bg-gray-900/60"
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-blue-100 dark:bg-blue-900/50">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-body font-semibold text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">{category.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} produtos
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}