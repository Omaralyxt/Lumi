import { Product, Review } from "../types/product";
import { supabase } from '@/integrations/supabase/client';

// Função auxiliar para mapear dados do Supabase para o tipo Product
const mapSupabaseProductToFrontend = (product: any): Product => {
  const variants = product.product_variants || [];
  const basePrice = variants.length > 0 ? variants[0].price : 0;
  const baseStock = variants.length > 0 ? variants[0].stock : 0;

  // Extrair URLs de imagem da nova relação product_images
  const images = (product.product_images || [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((img: any) => img.image_url);
    
  // Se não houver imagens na tabela, usar a imagem principal (image_url) se existir, ou placeholder
  const finalImages = images.length > 0 
    ? images 
    : (product.image_url ? [product.image_url] : ['/placeholder.svg']);

  const storeId = product.stores?.id || 'unknown';

  // Nota: Reviews, Q&A, Features, Specifications, Options são mockados/vazios
  // até que tenhamos as tabelas correspondentes no Supabase.
  return {
    id: product.id,
    title: product.name,
    description: product.description || 'Sem descrição.',
    price: basePrice,
    originalPrice: undefined,
    rating: 4.5, // Mocked rating
    reviewCount: 0, // Mocked count
    shop: {
      id: storeId,
      name: product.stores?.name || 'Loja Desconhecida',
      rating: 4.5,
      reviewCount: 0,
      isVerified: product.stores?.active || false,
      memberSince: product.stores?.created_at ? new Date(product.stores.created_at).toLocaleDateString('pt-MZ', { year: 'numeric' }) : 'N/A',
      productCount: 0,
    },
    stock: baseStock,
    category: product.category || 'Outros',
    features: ["Recurso 1", "Recurso 2"], // Mocked
    specifications: { "Detalhe": "Valor" }, // Mocked
    deliveryInfo: { city: 'Maputo', fee: 150, eta: '1-2 dias' }, // Mocked
    reviews: [], // Mocked
    qa: [], // Mocked
    images: finalImages,
    options: [], // Mocked
    timeDelivery: '2-5 dias úteis', // Mocked
  } as Product;
};

// Função de consulta base
const baseProductQuery = () => supabase
  .from('products')
  .select(`
    id, 
    name, 
    description, 
    image_url, 
    category,
    created_at,
    stores (id, name, active, created_at),
    product_variants (price, stock),
    product_images (image_url, sort_order)
  `);

// Função para buscar produto por ID
export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await baseProductQuery()
    .eq('id', id)
    .single();
  
  if (error || !data) {
    throw new Error("Produto não encontrado");
  }
  
  return mapSupabaseProductToFrontend(data);
};

// Função para buscar produtos similares (por categoria)
export const getSimilarProducts = async (category: string, excludeId?: number): Promise<Product[]> => {
  const { data, error } = await baseProductQuery()
    .eq('category', category)
    .neq('id', excludeId)
    .limit(4);
    
  if (error) {
    console.error("Erro ao buscar produtos similares:", error);
    return [];
  }
  
  return data.map(mapSupabaseProductToFrontend);
};

// Função para buscar todos os produtos
export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await baseProductQuery();
  
  if (error) {
    console.error("Erro ao buscar todos os produtos:", error);
    return [];
  }
  
  return data.map(mapSupabaseProductToFrontend);
};

// Função para buscar produtos por categoria
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await baseProductQuery()
    .eq('category', category);
    
  if (error) {
    console.error("Erro ao buscar produtos por categoria:", error);
    return [];
  }
  
  return data.map(mapSupabaseProductToFrontend);
};

// Função para buscar produtos em destaque (simulando por data de criação)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await baseProductQuery()
    .order('created_at', { ascending: false })
    .limit(6);
    
  if (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return [];
  }
  
  return data.map(mapSupabaseProductToFrontend);
};

// Função para submeter uma nova avaliação (mantida mockada, pois não temos tabela de reviews)
export const submitReview = async (
  productId: number, 
  reviewData: Omit<Review, 'id' | 'author' | 'date'>
): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Simulação de retorno de produto atualizado
  const mockProduct = await getProductById(productId.toString());
  
  const newReview: Review = {
    ...reviewData,
    id: Date.now(),
    author: "Utilizador Anónimo", // Simulado
    date: "agora mesmo",
  };

  // Simular atualização de reviews
  mockProduct.reviews.unshift(newReview);
  mockProduct.reviewCount++;
  
  return mockProduct;
};