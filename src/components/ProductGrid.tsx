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
}

export default function ProductGrid({ products, title, showStoreInfo = false }: ProductGridProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Memoize the handleBuy function to prevent unnecessary re-renders
  const handleBuy = useCallback((product: Product) => {
    addToCart(product, 1);
  }, [addToCart]);

  // Memoize the product cards to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    return products.map((product) => (
      <div
        key={product.id}
        className="relative group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-transparent shadow-[0_0_15px_rgba(0,170,255,0.1)] hover:shadow-neon-blue-lg transition-all duration-300 hover:scale-[1.02] dark:border-neon-blue/30 dark:hover:border-neon-blue"
      >
        {/* Imagem - Clicável para página de vendas */}
        <Link to={`/sales/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full aspect-square object-cover rounded-t-2xl cursor-pointer"
            loading="lazy"
          />
        </Link>

        {/* Conteúdo */}
        <div className="p-4">
          <Link to={`/sales/${product.id}`}>
            <h3 className="font-body font-semibold truncate text-gray-900 dark:text-gray-100 hover:text-blue-500 transition-colors cursor-pointer">
              {product.title}
            </h3>
          </Link>

          {/* Nome da loja como texto simples, se necessário */}
          {showStoreInfo && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Vendido por: {product.shop.name}
            </p>
          )}
          
          <div className="flex items-center mt-2">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating.toFixed(1)}</span>
          </div>

          <p className="text-lg font-bold mt-2 text-gray-800 dark:text-gray-200">
            MT {product.price.toLocaleString('pt-MZ')}
          </p>

          <div className="flex justify-between items-center mt-3">
            {/* Botão de Compra Principal */}
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-xl transition-all"
              onClick={() => handleBuy(product)}
            >
              <ShoppingBag size={16} /> Adicionar
            </button>

            <FavoriteButton 
              product={product} 
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 hover:shadow-neon-blue transition"
            />
          </div>
        </div>
      </div>
    ));
  }, [products, handleBuy, showStoreInfo]);

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