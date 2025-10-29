Subcategories) and maintaining product counts.">
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PRODUCT_CATEGORIES, CategoryItem } from '@/constants/categories';
import { getCategoryCounts } from '@/api/search';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

// Mapeamento simples de ícones para grupos de categorias
const categoryIcons: Record<string, string> = {
  "Moda e Estilo": '👗',
  "Tecnologia e Eletrônicos": '📱',
  "Casa e Decoração": '🏠',
  "Eletrodomésticos": '🧺',
  "Beleza e Cuidados Pessoais": '💄',
  "Bebés e Crianças": '🧸',
  "Ferramentas e Construção": '🔨',
  "Automóveis e Motos": '🚗',
  "Papelaria e Escritório": '📚',
  "Esportes e Lazer": '⚽',
  "Supermercado e Alimentos": '🛒',
  "Saúde e Bem-estar": '💊',
  "Animais de Estimação": '🐾',
  "Entretenimento e Cultura": '🎬',
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<CategoryItem | null>(null);
  
  // Fetch product counts from Supabase
  const { data: categoryCounts = {}, isLoading: isLoadingCounts } = useQuery<Record<string, number>>({
    queryKey: ['categoryCounts'],
    queryFn: getCategoryCounts,
  });

  // 1. Mapear grupos com contagens totais e subcategorias filtradas
  const categorizedData = useMemo(() => {
    return PRODUCT_CATEGORIES.map(group => {
      const totalCount = group.categories.reduce((sum, name) => sum + (categoryCounts[name] || 0), 0);
      
      const subcategories = group.categories.map(name => ({
        name,
        count: categoryCounts[name] || 0,
      })).filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return {
        ...group,
        icon: categoryIcons[group.group] || '📦',
        totalCount,
        subcategories,
      };
    }).filter(group => group.subcategories.length > 0 || group.group.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [categoryCounts, searchTerm]);

  const handleGroupClick = (group: CategoryItem) => {
    setSelectedGroup(group);
    setSearchTerm(''); // Limpa a busca ao entrar no grupo
  };

  const handleSubcategoryClick = (categoryName: string) => {
    // Cria um slug a partir do nome da subcategoria para a URL
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    navigate(`/category/${slug}`);
  };
  
  const handleBack = () => {
    if (selectedGroup) {
      setSelectedGroup(null);
      setSearchTerm('');
    } else {
      navigate(-1);
    }
  };

  // Conteúdo a ser exibido (Grupos ou Subcategorias)
  const displayData = selectedGroup ? selectedGroup.subcategories : categorizedData;
  const isGroupView = !selectedGroup;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedGroup ? selectedGroup.group : "Categorias"}
            </h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={isGroupView ? "Buscar grupos ou subcategorias..." : `Buscar em ${selectedGroup?.group}...`}
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
        {isLoadingCounts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(isGroupView ? 8 : 10)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayData.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                Nenhum resultado encontrado para "{searchTerm}".
              </div>
            )}
            
            {isGroupView ? (
              // Visualização de Grupos
              categorizedData.map((group) => (
                <Card 
                  key={group.group} 
                  className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800"
                  onClick={() => handleGroupClick(group)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">{group.icon}</div>
                    <h3 className="font-body font-semibold text-lg mb-1 line-clamp-1 dark:text-white">{group.group}</h3>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-gray-200 text-gray-700 dark:bg-blue-700 dark:text-white"
                    >
                      {group.totalCount} produtos
                    </Badge>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Visualização de Subcategorias
              displayData.map((category) => (
                <Card 
                  key={category.name} 
                  className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800"
                  onClick={() => handleSubcategoryClick(category.name)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-body font-semibold text-base line-clamp-1 dark:text-white">{category.name}</h3>
                      <Badge 
                        variant="secondary" 
                        className="text-xs mt-1 bg-gray-200 text-gray-700 dark:bg-blue-700 dark:text-white"
                      >
                        {category.count} produtos
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}