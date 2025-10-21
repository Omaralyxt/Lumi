import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFeaturedProducts, getAllProducts } from "../api/products";
import { getFeaturedStores } from "../api/stores";
import AdvancedSearch from "../components/AdvancedSearch";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import { Star, Package, Store, TrendingUp, Zap, Heart } from "lucide-react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredStores, setFeaturedStores] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
        
        const stores = await getFeaturedStores();
        setFeaturedStores(stores);
        
        const allProducts = await getAllProducts();
        setSuggestedProducts(allProducts.slice(0, 8));
        
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
    return <Loading />;
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
    <div className="w-full min-h-screen font-body bg-gray-50 dark:bg-gray-950 pb-20 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Topo: Logo e Barra de Pesquisa (Estilo iOS) */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4 flex flex-col items-center">
        <div className="w-full max-w-7xl flex justify-between items-center mb-4">
          <h1 className="font-title text-4xl text-gray-900 dark:text-gray-100 tracking-wide">Lumi</h1>
          <button
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl hover:scale-105 transition"
            onClick={() => navigate("/favorites")}
          >
            <Heart className="text-blue-400" /> Favoritos
          </button>
        </div>
        <div className="w-full max-w-2xl">
          <AdvancedSearch />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Banner de Ofertas */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
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
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title text-2xl flex items-center text-gray-900 dark:text-white">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
              Produtos em Destaque
            </h2>
            <Link to="/offers" className="text-blue-600 hover:text-blue-700 font-body text-sm">
              Ver Todos →
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} showStoreInfo={false} />
        </section>

        {/* Lojas em destaque */}
        <section className="mt-12">
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
                className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-sm flex flex-col items-center p-4 hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-[rgba(0,170,255,0.6)] hover:scale-[1.02]"
              >
                <div className="relative mb-3">
                  <img
                    src={store.logo_url}
                    alt={store.name}
                    className="w-20 h-20 object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
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
        <section className="mt-12 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title text-2xl flex items-center text-gray-900 dark:text-white">
              <Package className="h-6 w-6 mr-2 text-blue-600" />
              Você pode gostar
            </h2>
            <Link to="/todos" className="text-blue-600 hover:text-blue-700 font-body text-sm">
              Ver Todos →
            </Link>
          </div>
          
          <ProductGrid products={suggestedProducts} />
        </section>
      </main>
    </div>
  );
}