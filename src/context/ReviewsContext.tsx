"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Review } from '@/types/product';
import { toast } from "sonner";
import { fetchReviewsByProductId, submitReview as submitReviewApi } from '@/api/reviews';

interface ReviewsContextType {
  reviews: Record<string, Review[]>; // productId (string UUID) -> reviews
  loading: boolean;
  error: string | null;
  fetchReviews: (productId: string) => Promise<void>;
  submitReview: (productId: string, review: Omit<Review, 'id' | 'author' | 'date'>) => Promise<void>;
  getProductRating: (productId: string) => { average: number; count: number };
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Não usamos mais localStorage para reviews, dependemos da API

  const fetchReviews = async (productId: string) => {
    // Se já temos reviews para este produto, evitamos requisições repetidas
    if (reviews[productId] && reviews[productId].length > 0) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const fetchedReviews = await fetchReviewsByProductId(productId);
      
      setReviews(prev => ({
        ...prev,
        [productId]: fetchedReviews
      }));
    } catch (err) {
      setError("Falha ao carregar avaliações");
      toast.error("Falha ao carregar avaliações");
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (productId: string, reviewData: Omit<Review, 'id' | 'author' | 'date'>) => {
    setLoading(true);
    try {
      const newReview = await submitReviewApi({
        product_id: productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images,
      });
      
      setReviews(prev => ({
        ...prev,
        [productId]: [newReview, ...(prev[productId] || [])]
      }));
      
      toast.success("Avaliação enviada com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Falha ao enviar avaliação");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductRating = (productId: string) => {
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