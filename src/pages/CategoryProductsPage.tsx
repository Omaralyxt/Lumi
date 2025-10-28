"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory } from "@/api/products";
import { Product } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import Loading from "@/components/Loading";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mapeamento de slug para nome de categoria (para exibição)
const categoryMap: Record<string, string> = {
  "eletronicos": "Eletrónicos",
  "moda": "Moda",
  "casa-cozinha": "Casa & Cozinha",
  "saude-beleza": "Saúde & Beleza",
  "desporto": "Desporto",
  "livros": "Livros",
  "bebes-criancas": "Bebés & Crianças",
  "automovel": "Automóvel",
};

export default function CategoryProductsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryName = slug ? categoryMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Categoria";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        
        // Usamos o nome da categoria para buscar na API refatorada
        const fetchedProducts = await getProductsByCategory(categoryName);
        setProducts(fetchedProducts);
        
      } catch (err) {
        setError("Erro ao carregar produtos desta categoria.");
        console.error("Erro ao buscar produtos por categoria:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, categoryName]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <Button asChild>
            <Link to="/categories">Voltar para Categorias</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-body text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-title text-4xl text-gray-900 dark:text-gray-100 tracking-wide">
            {categoryName}
          </h1>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold">Nenhum produto encontrado</h2>
            <p className="text-gray-600 mb-4">Ainda não temos produtos nesta categoria.</p>
          </div>
        ) : (
          <ProductGrid products={products} title={`Produtos em ${categoryName}`} />
        )}
      </div>
    </div>
  );
}