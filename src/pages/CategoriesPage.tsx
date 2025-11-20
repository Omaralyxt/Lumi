"use client";

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import { CATEGORY_GROUP_IMAGES } from '@/constants/categoryImages'; // Importação adicionada
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // Mantido para o caso de uso futuro, mas não usado no SubCategoryCard

// Componente de Subcategoria com o novo estilo
interface SubCategoryCardProps {
  name: string;
  imageUrl: string; // Alterado para imageUrl
  onClick: () => void;
}

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ name, imageUrl, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center text-center p-3 cursor-pointer rounded-xl transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-neon-blue-lg hover:border-neon-blue/50"
      onClick={onClick}
    >
      {/* Imagem em círculo visível */}
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-2 shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg'; // Fallback
            e.currentTarget.className = "w-full h-full object-contain p-2";
          }}
        />
      </div>
      {/* Nome da subcategoria */}
      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{name}</p>
    </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-title tracking-wide">
            Explorar Categorias
          </h1>
        </div>

        {/* Category Groups and Subcategories Grid */}
        <div className="space-y-8">
          {PRODUCT_CATEGORIES.map((groupData) => (
            <section key={groupData.group}>
              <h2 className="font-body font-semibold text-xl mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                {groupData.group}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {groupData.categories.map((category) => {
                  // Usa a imagem do grupo principal para todas as subcategorias
                  const groupImageUrl = CATEGORY_GROUP_IMAGES[groupData.group] || '/placeholder.svg';
                  
                  return (
                    <SubCategoryCard
                      key={category}
                      name={category}
                      imageUrl={groupImageUrl}
                      onClick={() => handleCategoryClick(category)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}