"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  productId: number;
  className?: string;
}

export default function FavoriteButton({ productId, className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregar estado do favorito do localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(productId));
  }, [productId]);

  const toggleFavorite = async () => {
    setLoading(true);
    
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      if (isFavorite) {
        // Remover dos favoritos
        const newFavorites = favorites.filter((id: number) => id !== productId);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        setIsFavorite(false);
      } else {
        // Adicionar aos favoritos
        favorites.push(productId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        setIsFavorite(true);
      }
      
      // Em um app real, salvaria no backend
      // await fetch(`/api/favorites/${productId}`, {
      //   method: isFavorite ? 'DELETE' : 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      
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
      onClick={toggleFavorite}
      disabled={loading}
      className={className}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
    </Button>
  );
}