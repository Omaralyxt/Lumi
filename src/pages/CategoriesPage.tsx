"use client";

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

// Componente de Categoria Individual
interface CategoryItemProps {
  name: string;
  icon: string;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, icon, onClick }) => (
  <Card 
    className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800"
    onClick={onClick}
  >
    <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{name}</p>
    </CardContent>
  </Card>
);

// Componente de Grupo de Categoria
interface CategoryGroupProps {
  group: string;
  categories: string[];
  icon: string;
  onCategoryClick: (group: string, category: string) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ group, categories, icon, onCategoryClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{group}</h2>
        </div>
        {/* ChevronLeft icon removed here */}
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t dark:border-gray-700">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <Button 
                key={category} 
                variant="ghost" 
                className="justify-start h-auto py-2 px-3 text-left dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => onCategoryClick(group, category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default function CategoriesPage() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const icons: Record<string, string> = useMemo(() => ({
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
  }), []);

  const handleCategoryClick = (group: string, category: string) => {
    const groupSlug = group.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    navigate(`/search?category=${categorySlug}&group=${groupSlug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Todas as Categorias
          </h1>
        </div>

        {/* Category Groups */}
        <div className="space-y-4">
          {PRODUCT_CATEGORIES.map((groupData) => (
            <CategoryGroup
              key={groupData.group}
              group={groupData.group}
              categories={groupData.categories}
              icon={icons[groupData.group] || '📦'}
              onCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}