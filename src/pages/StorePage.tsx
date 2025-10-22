"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getStoreById, getProductsByStoreId } from "@/api/stores";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Store, CheckCircle, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StoreProfile {
  id: number;
  name: string;
  logo_url: string;
  rating: number;
  products_count: number;
  is_verified: boolean;
  description: string;
}

export default function StorePage() {
  const { id } = useParams();
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const storeId = parseInt(id);
        const [storeData, productsData] = await Promise.all([
          getStoreById(storeId),
          getProductsByStoreId(storeId)
        ]);
        setStore(storeData);
        setProducts(productsData);
      } catch (err) {
        setError("Não foi possível carregar os dados da loja.");
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error || "Loja não encontrada."}</p>
          <Button asChild>
            <Link to="/">Voltar para Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
          </div>
        </div>
      </div>

      {/* Store Profile Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img src={store.logo_url} alt={store.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
                  {store.is_verified && <CheckCircle className="h-6 w-6 text-green-500" />}
                </div>
                <p className="text-gray-600 mt-2">{store.description}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{store.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({products.length} avaliações)</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-600">{store.products_count} produtos</span>
                </div>
              </div>
              <Button>Seguir Loja</Button>
            </div>
          </div>
        </Card>

        {/* Products Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Produtos da Loja</h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar na loja..." className="pl-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <Link to={`/product/${product.id}`}>
                  <div className="relative">
                    <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 h-12">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-blue-600">MT {product.price.toLocaleString('pt-MZ')}</p>
                      {product.originalPrice && <p className="text-sm text-gray-500 line-through">MT {product.originalPrice.toLocaleString('pt-MZ')}</p>}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                  </div>
                  {/* CompareButton removido */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}