"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProducts, getAllProducts } from "../api/products";
import { Product } from "../types/product";
import { Star, Package, TrendingUp, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar produtos em destaque
        const featured = await getFeaturedProducts();
        setFeaturedProducts(featured);
        
        // Buscar todos os produtos
        const all = await getAllProducts();
        setAllProducts(all);
        
      } catch (err) {
        setError("Erro ao carregar produtos. Tente novamente.");
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 font-body">Lumi</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Package className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-title text-2xl font-body-semibold">Ofertas do Dia</h2>
            <Button variant="outline" size="sm">Ver Todos</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{Math.round((1 - product.price / product.originalPrice!) * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-title text-lg font-body-semibold line-clamp-2">{product.title}</h3>
                      <p className="font-body text-sm text-gray-600">{product.shop.name}</p>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-body text-sm">{product.rating}</span>
                        <span className="font-body text-gray-500 text-sm">•</span>
                        <span className="font-body text-sm text-gray-500">{product.stock} disponíveis</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-title text-xl font-bold text-blue-600 font-body-semibold">
                            MT {product.price.toLocaleString('pt-MZ')}
                          </span>
                          {product.originalPrice && (
                            <span className="font-body text-sm text-gray-500 line-through ml-2">
                              MT {product.originalPrice.toLocaleString('pt-MZ')}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="h-8 w-8 p-0">
                          <Package className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-title text-2xl font-body-semibold">Todos os Produtos</h2>
            <Button variant="outline" size="sm">Ver Mais</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {product.originalPrice && (
                        <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-title text-base font-body-semibold line-clamp-2">{product.title}</h3>
                      <p className="font-body text-xs text-gray-600">{product.shop.name}</p>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="font-body text-xs">{product.rating}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-title text-sm font-bold text-blue-600 font-body-semibold">
                          MT {product.price.toLocaleString('pt-MZ')}
                        </span>
                        <Button size="sm" className="h-6 w-6 p-0">
                          <Package className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}