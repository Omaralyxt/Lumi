"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types/product";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductGridProps {
  products: Product[];
  title?: string;
  showStoreInfo?: boolean;
  loading?: boolean;
}

export default function ProductGrid({ products, title, showStoreInfo = true, loading = false }: ProductGridProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState(new Set());

  // Memoize the handleBuy function to prevent unnecessary re-renders
  const handleBuy = useCallback((product: Product) => {
    addToCart(product, 1);
    toast.success(`${product.title} adicionado ao carrinho!`);
  }, [addToCart]);

  // Memoize the toggleFavorite function
  const toggleFavorite = useCallback((productId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
      toast.info("Produto removido dos favoritos");
    } else {
      newFavorites.add(productId);
      toast.success("Produto adicionado aos favoritos");
    }
    setFavorites(newFavorites);
  }, [favorites]);

  // Memoize the product cards to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    if (loading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      ));
    }

    return products.map((product) => (
      <div
        key={product.id}
        className="relative group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-transparent hover:border-[rgba(0,170,255,0.6)] shadow-[0_0_15px_rgba(0,170,255,0.1)] hover:shadow-[0_0_25px_rgba(0,170,255,0.4)] transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Imagem */}
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full aspect-square object-cover rounded-t-2xl"
            loading="lazy"
          />
        </Link>

        {/* Conteúdo */}
        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-body font-semibold truncate text-gray-900 dark:text-gray-100 hover:text-blue-500 transition-colors">
              {product.title}
            </h3>
          </Link>

          {showStoreInfo && (
            <Link to={`/store/${product.shop.id}`}>
              <p className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 cursor-pointer mt-1">
                {product.shop.name}
              </p>
            </Link>
          )}
          
          <div className="flex items-center mt-2">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating.toFixed(1)}</span>
          </div>

          <p className="text-lg font-bold mt-2 text-gray-800 dark:text-gray-200">
            MT {product.price.toLocaleString('pt-MZ')}
          </p>

          <div className="flex justify-between items-center mt-3">
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-xl transition-all"
              onClick={() => handleBuy(product)}
            >
              <ShoppingBag size={16} /> Comprar
            </button>

            <FavoriteButton 
              productId={product.id} 
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 hover:shadow-[0_0_10px_rgba(0,170,255,0.5)] transition"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(product.id);
              }}
            />
          </div>
        </div>
      </div>
    ));
  }, [products, loading, handleBuy, toggleFavorite, showStoreInfo]);

  return (
    <div className="font-body">
      {title && (
        <h2 className="font-title text-3xl mb-8 text-center tracking-wide text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {productCards}
      </div>
    </div>
  );
}