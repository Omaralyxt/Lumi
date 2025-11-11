import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { searchProducts, getCategories } from "../api/search";
import { Star, Package, Store, X, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils"; // Importação adicionada

// Tipagem básica para o componente
interface AdvancedSearchProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

interface Category {
  id: number;
  nome: string;
}

// Slider de preço otimizado
interface PriceSliderProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (range: [number, number]) => void;
}

function PriceSlider({ minPrice = 0, maxPrice = 100000, onChange }: PriceSliderProps) {
  const [value, setValue] = useState([minPrice, maxPrice]);

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: [number, number] = [Number(e.target.value), value[1]];
    setValue(newValue);
    onChange(newValue);
  }, [value, onChange]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: [number, number] = [value[0], Number(e.target.value)];
    setValue(newValue);
    onChange(newValue);
  }, [value, onChange]);

  const formatPriceDisplay = useCallback((price: number) => {
    // Usamos formatCurrency para a exibição
    return formatCurrency(price);
  }, []);

  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="flex items-center justify-between">
        <label className="font-body font-medium text-gray-700 dark:text-gray-300">
          Faixa de preço
        </label>
        <span className="font-body text-sm text-blue-600 font-semibold">
          {formatPriceDisplay(value[0])} - {formatPriceDisplay(value[1])}
        </span>
      </div>
      
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">MZN</span>
          <Input
            type="number"
            min={minPrice}
            max={value[1]}
            value={value[0]}
            onChange={handleMinChange}
            className="pl-10 pr-3 text-sm"
          />
        </div>
        <span className="text-gray-500 font-bold">-</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">MZN</span>
          <Input
            type="number"
            min={value[0]}
            max={maxPrice}
            value={value[1]}
            onChange={handleMaxChange}
            className="pl-10 pr-3 text-sm"
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
        {/* Range inputs are complex to style consistently across browsers, 
            but we keep them for functionality. We remove pointer-events-none 
            to allow interaction, which is necessary for range inputs. 
            The visual representation is handled by the div above. */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={value[0]}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-transparent appearance-none opacity-0"
          style={{ zIndex: 10 }}
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={value[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-transparent appearance-none opacity-0"
          style={{ zIndex: 10 }}
        />
      </div>
    </div>
  );
}

export default function AdvancedSearch({ initialQuery, onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [filter, setFilter] = useState<"products">("products"); // Apenas produtos
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance"); // relevance, price-low, price-high, rating
  const isInitialMount = useRef(true);

  // Load categories once
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);
  
  // Update query when initialQuery changes (e.g., from URL)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Debounced search effect
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Run initial search if query exists
      if (query.length >= 2) {
        performSearch();
      }
      return;
    }
    
    setLoading(true);
    
    const timeout = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, selectedCategory, priceRange, minRating, sortBy]); // Removido 'filter'

  const performSearch = useCallback(async () => {
    setLoading(true);
    
    // Sempre busca produtos
    const res = await searchProducts(query, selectedCategory, priceRange, minRating);
    
    // Aplicar ordenação
    let sortedResults = [...res];
    
    if (sortBy === "price-low") {
      sortedResults.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sortedResults.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      sortedResults.sort((a, b) => b.rating - a.rating);
    }
    
    setResults(sortedResults);
    setLoading(false);
  }, [query, selectedCategory, priceRange, minRating, sortBy]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery); // Atualiza a URL
  };

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    onSearch("");
  }, [onSearch]);

  // Removido handleFilterChange, pois o filtro é fixo em "products"

  return (
    <div className="w-full mx-auto font-body">
      {/* Filtro tipo (Removido) */}
      
      {/* Input de busca */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full pl-10 pr-10 rounded-xl p-3 transition-all"
            value={query}
            onChange={handleQueryChange}
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
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded-r-xl px-3 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Filtros adicionais para produtos */}
      {filter === "products" && showFilters && (
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-title font-semibold text-gray-800 dark:text-white">Filtros</h3>
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
              <label className="font-body font-medium text-gray-700 text-sm mb-1 block dark:text-gray-300">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <label className="font-body font-medium text-gray-700 text-sm mb-1 block dark:text-gray-300">
                Avaliação mínima
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
      {query.length >= 2 && (
        <div className="mt-6">
          {/* Ordenação */}
          {filter === "products" && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'} encontrados
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="relevance">Relevância</option>
                <option value="price-low">Preço: Menor para Maior</option>
                <option value="price-high">Preço: Maior para Menor</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-gray-700">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <p className="font-body text-gray-600 dark:text-gray-300">Nenhum resultado encontrado para "{query}"</p>
                <p className="font-body text-sm text-gray-500 mt-1">Tente usar termos diferentes ou ajustar os filtros</p>
              </div>
            ) : (
              <div>
                {results.map((item) =>
                  filter === "products" ? (
                    <Link
                      key={item.id}
                      to={`/sales/${item.id}`}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group dark:hover:bg-gray-800 dark:border-gray-700"
                    >
                      <div className="relative">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-body-semibold">
                            -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-title text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < Math.round(item.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="font-body text-xs text-gray-500">
                            ({(item.rating || 0).toFixed(1)})
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-title text-sm font-bold text-blue-600">
                            {formatCurrency(item.price)}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="font-body text-xs text-gray-500 line-through">
                              {formatCurrency(item.originalPrice)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Package className="h-5 w-5" />
                      </div>
                    </Link>
                  ) : (
                    // Removido o bloco de link para lojas
                    null
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}