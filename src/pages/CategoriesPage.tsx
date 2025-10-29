"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock Data for Categories
const mockCategories = [
  { id: '1', name: 'Eletrônicos', count: 120, icon: '📱' },
  { id: '2', name: 'Moda Feminina', count: 85, icon: '👗' },
  { id: '3', name: 'Casa & Cozinha', count: 210, icon: '🏠' },
  { id: '4', name: 'Esportes', count: 55, icon: '⚽' },
  { id: '5', name: 'Beleza', count: 90, icon: '💄' },
  { id: '6', name: 'Livros', count: 45, icon: '📚' },
  { id: '7', name: 'Automotivo', count: 30, icon: '🚗' },
  { id: '8', name: 'Brinquedos', count: 75, icon: '🧸' },
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(mockCategories);

  useEffect(() => {
    const filtered = mockCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCategories(filtered);
  }, [searchTerm]);

  const handleCategoryClick = (categoryId: string) => {
    // Navegar para a página de produtos filtrada pela categoria
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Categorias</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar categorias..."
                className="pl-10 w-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-body font-semibold text-sm mb-1 line-clamp-1 dark:text-white">{category.name}</h3>
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gray-200 text-gray-700 dark:bg-blue-700 dark:text-white"
                >
                  {category.count} produtos
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Nenhuma categoria encontrada para "{searchTerm}".
          </div>
        )}
      </main>
    </div>
  );
}