"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Search, 
  ArrowLeft, 
  Grid3X3, 
  Shirt, // Adicionado
  Smartphone, // Adicionado
  Home, // Adicionado
  Heart, // Adicionado
  Baby, // Adicionado
  Car, // Adicionado
  Book, // Adicionado
  Dumbbell, // Adicionado
  ShoppingCart // Adicionado
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SwipeablePage from "@/components/SwipeablePage";
import { PRODUCT_CATEGORIES, CategoryItem, getAllCategoryNames } from "@/constants/categories";
import { getCategoryCounts } from "@/api/search";
import Loading from "@/components/Loading";

// Mapeamento de ícones para grupos (usando ícones genéricos se não houver correspondência)
const groupIconMap: Record<string, React.ElementType> = {
  "Moda e Estilo": Shirt,
  "Tecnologia e Eletrônicos": Smartphone,
  "Casa e Decoração": Home,
  "Eletrodomésticos": Package,
  "Beleza e Cuidados Pessoais": Heart,
  "Bebés e Crianças": Baby,
  "Ferramentas e Construção": Package,
  "Automóveis e Motos": Car,
  "Papelaria e Escritório": Book,
  "Esportes e Lazer": Dumbbell,
  "Supermercado e Alimentos": ShoppingCart,
  "Saúde e Bem-estar": Heart,
  "Animais de Estimação": Package,
  "Entretenimento e Cultura": Book,
};

interface CategoryWithCount {
  name: string;
  count: number;
  slug: string;
}

interface GroupWithCounts extends CategoryItem {
  totalCount: number;
  subCategories: CategoryWithCount[];
}

export default function CategoriesPage() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts = await getCategoryCounts();
        setCategoryCounts(counts);
      } catch (e) {
        console.error("Failed to fetch category counts:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  // Processar e ordenar as categorias
  const sortedGroups = useMemo(() => {
    const groupsWithCounts: GroupWithCounts[] = PRODUCT_CATEGORIES.map(group => {
      let totalCount = 0;
      const subCategories: CategoryWithCount[] = group.categories.map(catName => {
        const count = categoryCounts[catName] || 0;
        totalCount += count;
        return {
          name: catName,
          count: count,
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        };
      });
      
      // Ordenar subcategorias por contagem
      subCategories.sort((a, b) => b.count - a.count);

      return {
        ...group,
        totalCount,
        subCategories,
      };
    });

    // Ordenar grupos principais pela contagem total de produtos
    groupsWithCounts.sort((a, b) => b.totalCount - a.totalCount);
    
    return groupsWithCounts;
  }, [categoryCounts]);
  
  // Filtrar categorias com base no termo de busca
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return sortedGroups;
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    return sortedGroups
      .map(group => {
        const filteredSubCategories = group.subCategories.filter(cat => 
          cat.name.toLowerCase().includes(lowerCaseSearch)
        );
        
        // Incluir o grupo se o nome do grupo ou alguma subcategoria corresponder
        if (group.group.toLowerCase().includes(lowerCaseSearch) || filteredSubCategories.length > 0) {
          return {
            ...group,
            subCategories: filteredSubCategories,
          };
        }
        return null;
      })
      .filter((group): group is GroupWithCounts => group !== null);
  }, [sortedGroups, searchTerm]);


  if (loading) {
    return <Loading />;
  }

  return (
    <SwipeablePage currentPage="categories">
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
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Categories List (Grouped and Sorted) */}
          <div className="space-y-8">
            {filteredGroups.map((group) => {
              const GroupIcon = groupIconMap[group.group] || Grid3X3;
              
              if (group.subCategories.length === 0 && searchTerm) return null; // Não mostra grupos vazios na busca

              return (
                <div key={group.group}>
                  <div className="flex items-center mb-4 border-b pb-2">
                    <GroupIcon className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                    <h2 className="font-title text-2xl font-bold text-gray-900 dark:text-white">
                      {group.group}
                    </h2>
                    <Badge variant="secondary" className="ml-3 text-sm">
                      {group.totalCount} produtos
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {group.subCategories.map((category) => (
                      <Link 
                        key={category.slug} 
                        to={`/category/${category.slug}`}
                        className="block"
                      >
                        <Card
                          className="product-card-style cursor-pointer transition-all hover:shadow-md dark:bg-gray-900/60"
                        >
                          <CardContent className="p-4">
                            <h3 className="font-body font-semibold text-sm mb-1 line-clamp-1">{category.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {category.count} produtos
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {filteredGroups.length === 0 && searchTerm && (
              <div className="text-center py-12 text-gray-500">
                Nenhuma categoria ou subcategoria encontrada para "{searchTerm}".
              </div>
            )}
          </div>
        </div>
      </div>
    </SwipeablePage>
  );
}