import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { searchProducts, searchStores, getCategories } from "../api/search";
import { Star, Package, Store, X, Search, Filter } from "lucide-react";

// Slider de preço otimizado
function PriceSlider({ minPrice = 0, maxPrice = 100000, onChange }) {
  const [value, setValue] = useState([minPrice, maxPrice]);
  const [isDragging, setIsDragging] = useState(false);

  const handleMinChange = (e) => {
    const newValue = [Number(e.target.value), value[1]];
    setValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (e) => {
    const newValue = [value[0], Number(e.target.value)];
    setValue(newValue);
    onChange(newValue);
  };

  const formatPrice = (price) => {
    return `MT ${price.toLocaleString('pt-MZ')}`;
  };

  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="flex items-center justify-between">
        <label className="font-body font-medium text-gray-700">
          Faixa de preço
        </label>
        <span className="font-body text-sm text-blue-600 font-semibold">
          {formatPrice(value[0])} - {formatPrice(value[1])}
        </span>
      </div>
      
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">MT</span>
          <input
            type="number"
            min={minPrice}
            max={value[1]}
            value={value[0]}
            onChange={handleMinChange}
            className="w-full pl-8 pr-3 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <span className="text-gray-500 font-bold">-</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">MT</span>
          <input
            type="number"
            min={value[0]}
            max={maxPrice}
            value={value[1]}
            onChange={handleMaxChange}
            className="w-full pl-8 pr-3 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gray-200 rounded-full"></div>
        </div>
        <div 
          className="absolute h-1 bg-blue-600 rounded-full"
          style={{
            left: `${((value[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
            right: `${100 - ((value[1] - minPrice) / (maxPrice - minPrice)) * 100}%`
          }}
        ></div>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={value[0]}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none"
          style={{
            WebkitAppearance: 'none',
            zIndex: 10
          }}
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={value[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none"
          style={{
            WebkitAppearance: 'none',
            zIndex: 10
          }}
        />
      </div>
    </div>
  );
}

export default function AdvancedSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("products"); // products ou stores
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    // Fechar resultados quando clicar fora
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    setLoading(true);
    
    const timeout = setTimeout(() => {
      if (filter === "products") {
        searchProducts(query, selectedCategory, priceRange, minRating).then(
          (res) => {
            setResults(res);
            setLoading(false);
          }
        );
      } else {
        searchStores(query).then((res) => {
          setResults(res);
          setLoading(false);
        });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, filter, selectedCategory, priceRange, minRating]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedCategory("");
    setMinRating(0);
    setPriceRange([0, 100000]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 font-body" ref={searchRef}>
      {/* Filtro tipo */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => handleFilterChange("products")}
          className={`px-4 py-2 rounded-full font-body font-medium transition-all ${
            filter === "products"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Package className="h-4 w-4 inline mr-1" />
          Produtos
        </button>
        <button
          onClick={() => handleFilterChange("stores")}
          className={`px-4 py-2 rounded-full font-body font-medium transition-all ${
            filter === "stores"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Store className="h-4 w-4 inline mr-1" />
          Lojas
        </button>
      </div>

      {/* Input de busca */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={`Buscar ${filter === "products" ? "produtos" : "lojas"}...`}
            className="w-full pl-10 pr-10 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Botão de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded-r-xl px-3 transition-colors"
        >
          <Filter className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Filtros adicionais para produtos */}
      {filter === "products" && showFilters && (
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-title font-semibold text-gray-800">Filtros</h3>
            <button
              onClick={() => {
                setSelectedCategory("");
                setMinRating(0);
                setPriceRange([0, 100000]);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-body"
            >
              Limpar todos
            </button>
          </div>

          <div className="space-y-4">
            {/* Categoria */}
            <div>
              <label className="font-body font-medium text-gray-700 text-sm mb-1 block">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
              >
                <option value="">Todas categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Avaliação mínima */}
            <div>
              <label className="font-body font-medium text-gray-700 text-sm mb-1 block">
                Avaliação mínima
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
              >
                <option value={0}>Todas avaliações</option>
                {[1, 2, 3, 4].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} estrela{rating > 1 ? 's' : ''} ou mais
                  </option>
                ))}
              </select>
            </div>

            {/* Faixa de preço */}
            <PriceSlider
              minPrice={0}
              maxPrice={100000}
              onChange={(range) => setPriceRange(range)}
            />
          </div>
        </div>
      )}

      {/* Resultados */}
      {showResults && (
        <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
            </div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-body text-gray-600">Nenhum resultado encontrado para "{query}"</p>
              <p className="font-body text-sm text-gray-500 mt-1">Tente usar termos diferentes ou ajustar os filtros</p>
            </div>
          ) : (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="font-body text-sm text-gray-600">
                  {results.length} {results.length === 1 ? 'resultado' : 'resultados'} encontrados
                </p>
              </div>
              
              {results.map((item) =>
                filter === "products" ? (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group"
                  >
                    <div className="relative">
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      {item.preco_promocional && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-body-semibold">
                          -{Math.round((1 - item.preco_promocional / item.preco) * 100)}%
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-title text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.nome}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex items-center">
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < Math.round(item.avaliacao_media || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`} 
                          />
                        </div>
                        <span className="font-body text-xs text-gray-500">
                          ({item.avaliacao_media?.toFixed(1) || '0.0'})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-title text-sm font-bold text-blue-600">
                          {item.preco_promocional 
                            ? `MT ${item.preco_promocional.toLocaleString('pt-MZ')}`
                            : `MT ${item.preco.toLocaleString('pt-MZ')}`
                          }
                        </p>
                        {item.preco_promocional && (
                          <p className="font-body text-xs text-gray-500 line-through">
                            MT {item.preco.toLocaleString('pt-MZ')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Package className="h-5 w-5" />
                    </div>
                  </Link>
                ) : (
                  <Link
                    key={item.id}
                    to={`/loja/${item.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group"
                  >
                    <div className="relative">
                      <img
                        src={item.logo_url}
                        alt={item.nome}
                        className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      {item.is_verified && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-body-semibold">
                          ✓
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-title text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.nome}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="font-body text-xs text-gray-600 ml-1">
                            {item.rating?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                        <span className="font-body text-xs text-gray-500">
                          {item.produtos_count} produtos
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Store className="h-5 w-5" />
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}