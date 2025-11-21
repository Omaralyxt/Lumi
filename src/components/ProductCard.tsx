"use client";

import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types/product";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils"; // Importação adicionada
import { Badge } from "./ui/badge"; // Importação adicionada

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // O preço de corte é mapeado para product.originalPrice
  const currentPrice = product.price;
  const originalPrice = product.originalPrice;
  
  const discountPercentage = originalPrice && originalPrice > currentPrice
    ? Math.round((1 - currentPrice / originalPrice) * 100)
    : 0;

  const handleBuy = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Adiciona 1 unidade ao carrinho
    addToCart(product, 1);
  }, [addToCart, product]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, boxShadow: '0 0 15px rgba(0, 170, 255, 0.4)' }}
      className="relative group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-transparent shadow-[0_0_15px_rgba(0,170,255,0.1)] hover:shadow-neon-blue-lg transition-all duration-300 dark:border-neon-blue/30 dark:hover:border-neon-blue"
    >
      {/* Badge de Oferta */}
      {discountPercentage > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute top-2 left-2 z-10 text-xs font-bold"
        >
          -{discountPercentage}% OFF
        </Badge>
      )}
      
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

        <div className="flex items-center mt-2">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating.toFixed(1)}</span>
        </div>

        <div className="mt-2">
          {originalPrice && discountPercentage > 0 && (
            <p className="text-xs text-gray-500 line-through">
              {formatCurrency(originalPrice)}
            </p>
          )}
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {formatCurrency(currentPrice)}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3">
          {/* Botão de Compra Principal */}
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-xl transition-all"
            onClick={handleBuy}
          >
            <ShoppingBag size={16} /> Adicionar
          </button>

          <FavoriteButton 
            product={product} 
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 hover:shadow-neon-blue transition"
          />
        </div>
      </div>
    </motion.div>
  );
}