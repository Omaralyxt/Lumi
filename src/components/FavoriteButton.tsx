"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/FavoritesContext";
import { Product } from "@/types/product";

interface FavoriteButtonProps {
  product: Product;
  className?: string;
}

export default function FavoriteButton({ product, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [loading, setLoading] = useState(false);
  const favoriteStatus = isFavorite(product.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulação de API call se necessário, mas o toggle já é instantâneo via Context
      toggleFavorite(product);
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={className}
    >
      <Heart className={`h-4 w-4 ${favoriteStatus ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
    </Button>
  );
}