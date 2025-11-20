"use client";

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

// Componente de Subcategoria (mantido, mas estilizado para ser menor)
interface SubCategoryPillProps {
  name: string;
  onClick: () => void;
}

const SubCategoryPill: React.FC<SubCategoryPillProps> = ({ name, onClick }) => {
  return (
    <button 
      className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
      onClick={onClick}
    >
      {name}
    </button>
  );
};

// Componente de Grupo de Categoria (Card principal com imagem)
interface CategoryGroupCardProps {
  group: string;
  imageUrl?: string;
  categories: string[];
  handleCategoryClick: (category: string) => void;
}

const CategoryGroupCard: React.FC<CategoryGroupCardProps> = ({ group, imageUrl, categories, handleCategoryClick }) => {
  const navigate = useNavigate();
  
  // Função para navegar para a página de listagem de produtos da primeira subcategoria
  const handleViewAll = () => {
    if (categories.length > 0) {
      const categorySlug = categories[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      navigate(`/category/${categorySlug}`);
    }
  };

  return (
    <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-40">
        {/* Imagem de fundo */}
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={group}
          className="w-full h-full object-cover"
        />
        {/* Overlay para melhor contraste do texto */}
        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
          <h2 className="text-2xl font-title text-white tracking-wide">{group}</h2>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 6).map((category) => (
            <SubCategoryPill
              key={category}
              name={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
          {categories.length > 6 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 self-center ml-1">
              +{categories.length - 6} mais
            </span>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full dark:border-gray-700 dark:hover:bg-gray-700"
          onClick={handleViewAll}
        >
          Ver todos os produtos em {group}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};


export default function CategoriesPage() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    // Cria um slug a partir do nome da categoria
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    // Navega para a página de produtos da categoria
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-title tracking-wide">
            Explorar Categorias
          </h1>
        </div>

        {/* Category Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_CATEGORIES.map((groupData) => (
            <CategoryGroupCard
              key={groupData.group}
              group={groupData.group}
              imageUrl={groupData.image_url}
              categories={groupData.categories}
              handleCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}