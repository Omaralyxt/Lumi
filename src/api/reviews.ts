import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/product';

interface ReviewPayload {
  product_id: string;
  rating: number;
  comment: string;
  images?: string[];
}

// Função auxiliar para mapear dados do Supabase para o tipo Review
const mapSupabaseReviewToFrontend = (review: any): Review => {
  // Simulação de nome do autor, pois o nome completo não está diretamente no review
  const authorName = review.profiles?.first_name 
    ? `${review.profiles.first_name} ${review.profiles.last_name || ''}`.trim()
    : 'Usuário Anônimo';

  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment || '',
    author: authorName,
    date: new Date(review.created_at).toLocaleDateString('pt-MZ'),
    verifiedPurchase: false, // Implementação de verificação de compra é complexa, mantemos false por enquanto
    images: review.images || [],
  };
};

/**
 * Busca todas as avaliações para um produto específico.
 */
export async function fetchReviewsByProductId(productId: string): Promise<Review[]> {
  // Garantir que o productId é uma string válida (UUID)
  if (!productId || typeof productId !== 'string') {
    console.error("Invalid productId provided:", productId);
    return [];
  }
  
  const { data, error } = await supabase
    .from('product_reviews')
    .select(`
      *,
      profiles (first_name, last_name)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching reviews for product ID", productId, ":", error);
    throw new Error("Falha ao carregar avaliações.");
  }

  return data.map(mapSupabaseReviewToFrontend);
}

/**
 * Submete uma nova avaliação para um produto.
 */
export async function submitReview(payload: ReviewPayload): Promise<Review> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabase
    .from('product_reviews')
    .insert({
      product_id: payload.product_id,
      user_id: user.id,
      rating: payload.rating,
      comment: payload.comment,
      images: payload.images,
    })
    .select(`
      *,
      profiles (first_name, last_name)
    `)
    .single();

  if (error) {
    console.error("Error submitting review:", error);
    // Tratar erro de UNIQUE constraint (usuário já avaliou)
    if (error.code === '23505') {
      throw new Error("Você já avaliou este produto.");
    }
    throw new Error("Falha ao enviar avaliação.");
  }

  return mapSupabaseReviewToFrontend(data);
}