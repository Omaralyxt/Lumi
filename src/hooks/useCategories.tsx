"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  name: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): CategoriesState {
  const [state, setState] = useState<CategoriesState>({
    categories: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Usamos a função RPC para obter valores distintos da coluna 'category'
        // Nota: Supabase PostgREST não suporta SELECT DISTINCT em colunas não-PK diretamente via API,
        // mas podemos usar uma função ou uma view. Para simplicidade, vamos tentar uma consulta básica
        // e, se necessário, refatorar para uma função RPC.
        
        // Tentativa de buscar categorias distintas (requer que a coluna 'category' seja exposta)
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null)
          .order('category', { ascending: true });

        if (error) {
          throw error;
        }

        // Processar os dados para obter categorias únicas
        const uniqueCategories = Array.from(new Set(data.map(item => item.category))).filter(Boolean) as string[];
        
        const formattedCategories: Category[] = uniqueCategories.map(name => ({ name }));

        setState({
          categories: formattedCategories,
          loading: false,
          error: null,
        });

      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setState({
          categories: [],
          loading: false,
          error: err.message || 'Failed to fetch categories',
        });
      }
    };

    fetchCategories();
  }, []);

  return state;
}