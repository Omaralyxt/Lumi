"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchStores } from "@/api/stores"; // Importar a função de busca otimizada
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Store, CheckCircle, ArrowLeft, Search } from "lucide-react";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import SwipeablePage from "@/components/SwipeablePage";
import { Input } from "@/components/ui/input";

interface StoreProfile {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  banner_url: string | null;
  rating: number | null;
  products_count: number | null;
  is_verified: boolean;
  created_at: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar a função searchStores da API, que agora lida com a busca e contagem de produtos
      const fetchedStores = await searchStores(searchQuery);

      setStores(fetchedStores as StoreProfile[]);
    } catch (err: any) {
      console.error("Erro ao buscar lojas:", err);
      setError("Não foi possível carregar as lojas. Tente novamente.");
      toast.error("Falha ao carregar lojas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce simples para a busca
    const handler = setTimeout(() => {
      fetchStores();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // Dispara a busca sempre que a query muda

  if (loading) {
    return <Loading />;
  }

  return (
    <SwipeablePage currentPage="stores">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-body text-gray-900 dark:text-gray-100 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-title text-4xl tracking-wide">
              Lojas Parceiras
            </h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar lojas por nome..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-center py-8 text-red-600">{error}</div>
          )}

          {stores.length === 0 && !error ? (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold">Nenhuma loja encontrada</h2>
              <p className="text-gray-600 mb-4">Nenhuma loja ativa corresponde à sua busca.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {stores.map((store) => (
                <Card 
                  key={store.id} 
                  className="overflow-hidden group hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  {/* Banner (if exists) - Usando placeholder se banner_url for nulo */}
                  <div className="h-32 bg-gray-200 overflow-hidden">
                    <img 
                      src={store.banner_url || "/placeholder.svg"} 
                      alt={`Banner de ${store.name}`} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Logo */}
                    <img 
                      src={store.logo_url || "/placeholder.svg"} 
                      alt={store.name} 
                      className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 shadow-md flex-shrink-0 -mt-10 md:mt-0 object-cover"
                    />
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h2 className="text-xl font-bold truncate">{store.name}</h2>
                        {store.is_verified && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {store.description || "Sem descrição disponível."}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span>{store.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <span>•</span>
                        <span>{store.products_count || 0} produtos</span>
                        <span>•</span>
                        <span>Desde {new Date(store.created_at).toLocaleDateString('pt-MZ', { year: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/store/${store.id}`} className="flex-shrink-0 w-full md:w-auto">
                      <Button className="w-full md:w-auto">
                        <Store className="h-4 w-4 mr-2" />
                        Ver Produtos
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </SwipeablePage>
  );
}