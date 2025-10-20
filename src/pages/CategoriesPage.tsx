"use client";

import { useState } from "react";
import { Package, Smartphone, Shirt, Home, Heart, Dumbbell, Book, Baby, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    id: 1,
    name: "Eletrónicos",
    icon: Smartphone,
    description: "Smartphones, tablets, acessórios",
    count: 1245,
  },
  {
    id: 2,
    name: "Moda",
    icon: Shirt,
    description: "Roupas, calçados, acessórios",
    count: 892,
  },
  {
    id: 3,
    name: "Casa & Cozinha",
    icon: Home,
    description: "Móveis, eletrodomésticos, decoração",
    count: 567,
  },
  {
    id: 4,
    name: "Saúde & Beleza",
    icon: Heart,
    description: "Produtos de saúde e beleza",
    count: 423,
  },
  {
    id: 5,
    name: "Desporto",
    icon: Dumbbell,
    description: "Equipamentos desportivos, roupas",
    count: 334,
  },
  {
    id: 6,
    name: "Livros",
    icon: Book,
    description: "Livros, e-books, materiais",
    count: 298,
  },
  {
    id: 7,
    name: "Bebés & Crianças",
    icon: Baby,
    description: "Produtos para bebês e crianças",
    count: 267,
  },
  {
    id: 8,
    name: "Automóvel",
    icon: Car,
    description: "Peças, acessórios, serviços",
    count: 189,
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Categorias</h1>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar categorias..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isSelected ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <Icon className={`h-6 w-6 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{category.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {category.count} produtos
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Category Details */}
        {selectedCategory && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Fechar
                  </Button>
                </div>
                <p className="text-gray-600 mb-4">
                  {categories.find(c => c.id === selectedCategory)?.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {categories.find(c => c.id === selectedCategory)?.count} produtos disponíveis
                  </span>
                  <Button>Ver Produtos</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}