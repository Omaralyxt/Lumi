"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types/product";
import FavoriteButton from "./FavoriteButton";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion"; // Importação adicionada
import { formatCurrency } from "@/lib/utils"; // Importação adicionada
import ProductCard from "./ProductCard"; // Importando o ProductCard

interface ProductGridProps {
  products: Product[];
  title?: string;
  showStoreInfo?: boolean;
}

export default function ProductGrid({ products, title, showStoreInfo = false }: ProductGridProps) {
  // Memoize the product cards to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    return products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  }, [products]);

  return (
    <div className="font-body">
      {/* Removido o título aqui, pois ele será gerenciado pelo componente ProductSection na Home */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {productCards}
      </div>
    </div>
  );
}