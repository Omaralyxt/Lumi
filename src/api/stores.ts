import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

// Função auxiliar para mapear dados do Supabase para o tipo Product
const mapSupabaseProductToFrontend = (product: any, storeId: string): Product => {
  const variants = product.product_variants || [];
  const basePrice = variants.length > 0 ? variants[0].price : 0;
  const baseStock = variants.length > 0 ? variants[0].stock : 0;

  // Campos complexos (reviews, options, deliveryInfo) serão mockados ou definidos como vazios
  // pois não temos a estrutura completa no Supabase para eles ainda.
  return {
    id: product.id,
    title: product.name,
    description: product.description || 'Sem descrição.',
    price: basePrice,
    originalPrice: undefined, // Não temos originalPrice no Supabase
    rating: 4.5, // Mocked rating
    reviewCount: 0, // Mocked count
    shop: {
      id: storeId,
      name: product.stores?.name || 'Loja Desconhecida',
      rating: 4.5,
      reviewCount: 0,
      isVerified: product.stores?.active || false,
    },
    stock: baseStock,
    category: product.category || 'Outros',
    features: [], // Mocked
    specifications: {}, // Mocked
    deliveryInfo: { city: 'Maputo', fee: 150, eta: '1-2 dias' }, // Mocked
    reviews: [], // Mocked
    qa: [], // Mocked
    images: product.image_url ? [product.image_url] : ['/placeholder.svg'],
    options: [], // Mocked
    timeDelivery: '2-5 dias úteis', // Mocked
  } as Product;
};

// Função para buscar lojas em destaque (agora busca lojas ativas)
export const getFeaturedStores = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, logo_url, description, is_verified:active, created_at')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error("Erro ao buscar lojas em destaque:", error);
    return [];
  }
  
  return data.map(store => ({
    ...store,
    rating: 4.5, // Mocked
    products_count: 100, // Mocked
  }));
};

// Função para buscar lojas por busca (agora busca lojas ativas)
export const searchStores = async (query: string): Promise<any[]> => {
  let queryBuilder = supabase
    .from('stores')
    .select('id, name, logo_url, description, is_verified:active, created_at')
    .eq('active', true);

  if (query) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("Erro ao buscar lojas:", error);
    return [];
  }

  return data.map(store => ({
    ...store,
    rating: 4.5, // Mocked
    products_count: 100, // Mocked
  }));
};

// Função para buscar uma loja por ID (usando Supabase)
export const getStoreById = async (id: string): Promise<any> => {
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, logo_url, description, is_verified:active, created_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new Error("Loja não encontrada");
  }
  
  return {
    ...data,
    rating: 4.5, // Mocked
    products_count: 100, // Mocked
    is_verified: data.is_verified,
    memberSince: new Date(data.created_at).toLocaleDateString('pt-MZ', { year: 'numeric' }),
  };
};

// Função para buscar produtos de uma loja específica (usando Supabase)
export const getProductsByStoreId = async (storeId: string): Promise<Product[]> => {
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select(`
      id, 
      name, 
      description, 
      image_url, 
      category,
      stores (name, active),
      product_variants (price, stock)
    `)
    .eq('store_id', storeId);

  if (productsError) {
    console.error("Erro ao buscar produtos:", productsError);
    throw new Error("Falha ao carregar produtos da loja.");
  }

  return productsData.map(product => mapSupabaseProductToFrontend(product, storeId));
};