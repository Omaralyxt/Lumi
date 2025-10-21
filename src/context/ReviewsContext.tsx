"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Review } from '@/types/product';
import { toast } from "sonner";

interface ReviewsContextType {
  reviews: Record<number, Review[]>; // productId -> reviews
  loading: boolean;
  error: string | null;
  fetchReviews: (productId: number) => Promise<void>;
  submitReview: (productId: number, review: Omit<Review, 'id' | 'author' | 'date'>) => Promise<void>;
  getProductRating: (productId: number) => { average: number; count: number };
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Record<number, Review[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar avaliações do localStorage (em um app real, viria da API)
  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  // Salvar avaliações no localStorage
  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const fetchReviews = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      // Em um app real, isso faria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Se as avaliações já estiverem no estado, não buscar novamente
      if (reviews[productId]) {
        return;
      }
      
      // Simular dados de avaliações
      const mockReviews: Review[] = [
        {
          id: 1,
          rating: 5,
          comment: "Excelente produto, entrega rápida e em perfeito estado!",
          author: "João Silva",
          date: "2 dias atrás",
          verifiedPurchase: true,
          images: ["/placeholder.svg"]
        },
        {
          id: 2,
          rating: 4,
          comment: "Bom produto, só a bateria poderia durar um pouco mais.",
          author: "Maria Santos",
          date: "1 semana atrás",
          verifiedPurchase: true,
        }
      ];
      
      setReviews(prev => ({
        ...prev,
        [productId]: mockReviews
      }));
    } catch (err) {
      setError("Falha ao carregar avaliações");
      toast.error("Falha ao carregar avaliações");
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (productId: number, reviewData: Omit<Review, 'id' | 'author' | 'date'>) => {
    setLoading(true);
    try {
      // Em um app real, isso enviaria a avaliação para a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview: Review = {
        ...reviewData,
        id: Date.now(),
        author: "Usuário Anônimo", // Em um app real, viria do perfil do usuário
        date: "agora mesmo",
      };
      
      setReviews(prev => ({
        ...prev,
        [productId]: [newReview, ...(prev[productId] || [])]
      }));
      
      toast.success("Avaliação enviada com sucesso!");
    } catch (err) {
      toast.error("Falha ao enviar avaliação");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductRating = (productId: number) => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / productReviews.length;
    
    return {
      average: parseFloat(average.toFixed(1)),
      count: productReviews.length
    };
  };

  return (
    <ReviewsContext.Provider value={{ 
      reviews, 
      loading, 
      error, 
      fetchReviews, 
      submitReview,
      getProductRating
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};