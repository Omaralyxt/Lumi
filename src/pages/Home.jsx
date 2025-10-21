import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProducts, getAllProducts } from "../api/products";
import { getFeaturedStores } from "../api/stores";
import AdvancedSearch from "../components/AdvancedSearch";
import { Star, Package, Store, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredStores, setFeaturedStores] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar produtos em destaque
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
        
        // Buscar lojas em destaque (simulado)
        const stores = await getFeaturedStores();
        setFeaturedStores(stores);
        
        // Buscar produtos sugeridos (todos os produtos)
        const allProducts = await getAllProducts();
        setSuggestedProducts(allProducts.slice(0, 8)); // Limitar a 8 produtos
        
      } catch (err) {
        setError("Erro ao carregar dados. Tente novamente.");
        console.error("Erro ao buscar dados da home:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen font-body bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="font-body text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen font-body bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-body"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen font-body bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Topo: Logo e Barra de Pesquisa */}
      <header className="w-full py-6 flex flex-col items-center bg-white shadow-sm sticky top-0 z-40 dark:bg-gray-800">
        {/* Logotipo */}
        <div className="text-4xl font-title text-blue-600 mb-4">
          Lumi
        </div>
        {/* Barra de Pesquisa */}
        <div className="w-full max-w-2xl">
          <AdvancedSearch />
        </div>
      </header>

      {/* Banner de Ofertas */}
      <section className="mt-6 px-4 md:px-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-title text-2xl mb-2">Ofertas do Dia</h2>
              <p className="font-body text-blue-100">Produtos com até 50% de desconto!</p>
            </div>
            <div className="hidden md:block">
              <Zap className="h-12 w-12 text-yellow-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="mt-8 px-4 md:px-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-title text-2xl flex items-center text-gray-900 dark:text-white">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
            Produtos em Destaque
          </h2>
          <Link to="/ofertas" className="text-blue-600 hover:text-blue-700 font-body text-sm">
            Ver Todos →
          </Link>
        </div>
        
        {/* Grid de Produtos (mantido o mesmo) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-body-semibold">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-title text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                  {p.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-title text-sm font-bold text-blue-600">
                      MT {p.price.toLocaleString('pt-MZ')}
                    </p>
                    {p.originalPrice && (
                      <p className="font-body text-xs text-gray-500 line-through">
                        MT {p.originalPrice.toLocaleString('pt-MZ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="font-body text-xs text-gray-600 dark:text-gray-400 ml-1">
                      {p.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Lojas em destaque */}
      <section className="mt-12 px-4 md:px-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-title text-2xl flex items-center text-gray-900 dark:text-white">
            <Store className="h-6 w-6 mr-2 text-blue-600" />
            Lojas em Destaque
          </h2>
          <Link to="/lojas" className="text-blue-600 hover:text-blue-700 font-body text-sm">
            Ver Todas →
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredStores.map((store) => (
            <Link
              key={store.id}
              to={`/store/${store.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm flex flex-col items-center p-4 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative mb-3">
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="w-20 h-20 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
                {store.is_verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-body-semibold">
                    ✓
                  </div>
                )}
              </div>
              <h3 className="font-title text-base font-semibold text-gray-900 dark:text-white text-center group-hover:text-blue-600 transition-colors">
                {store.name}
              </h3>
              <div className="flex items-center mt-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="font-body text-xs text-gray-600 dark:text-gray-400 ml-1">
                  {store.rating}
                </span>
              </div>
              <p className="font-body text-xs text-gray-500 dark:text-gray-500 mt-1">
                {store.products_count} produtos
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Produtos sugeridos */}
      <section className="mt-12 px-4 md:px-12 mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-title text-2xl flex items-center text-gray-900 dark:text-white">
            <Package className="h-6 w-6 mr-2 text-blue-600" />
            Você pode gostar
          </h2>
          <Link to="/todos" className="text-blue-600 hover:text-blue-700 font-body text-sm">
            Ver Todos →
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestedProducts.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-body-semibold">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-title text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                  {p.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-title text-sm font-bold text-blue-600">
                      MT {p.price.toLocaleString('pt-MZ')}
                    </p>
                    {p.originalPrice && (
                      <p className="font-body text-xs text-gray-500 line-through">
                        MT {p.originalPrice.toLocaleString('pt-MZ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="font-body text-xs text-gray-600 dark:text-gray-400 ml-1">
                      {p.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}