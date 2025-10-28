import { supabase } from '@/integrations/supabase/client';
import { Product, ProductVariant } from '@/types/product';

// Função auxiliar para mapear dados do Supabase para o tipo Product
const mapSupabaseProductToFrontend = (product: any, storeId: string): Product => {
  const variants: ProductVariant[] = (product.product_variants || []).map((v: any) => ({
    id: v.id || 'mock-variant-' + Math.random(),
    name: v.name || 'Padrão',
    price: v.price || 0,
    stock: v.stock || 0,
    image_url: v.image_url,
    options: { Variant: v.name || 'Padrão' },
  }));
  
  const basePrice = variants.length > 0 ? variants[0].price : 0;
  const baseStock = variants.length > 0 ? variants[0].stock : 0;

  // Campos complexos (reviews, options, deliveryInfo) serão mockados ou definidos como vazios
  return {
    id: product.id, // product.id é string (UUID)
    title: product.name,
    description: product.description || 'Sem descrição.',
    price: basePrice,
    originalPrice: undefined, // Não temos originalPrice no Supabase
    rating: 4.5, // Mocked rating
    reviewCount: 0, // Mocked count
    shop: {
      id: storeId, // storeId é string (UUID)
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
    variants: variants, // Adicionando variantes
    timeDelivery: '2-5 dias úteis', // Mocked
  } as Product;
};

// Função auxiliar para buscar a contagem de produtos de uma loja (mantida para uso interno)
const getProductCount = async (storeId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', storeId);

  if (error) {
    console.error("Erro ao contar produtos:", error);
    return 0;
  }
  return count || 0;
};

// Função para buscar produtos de uma loja específica (mantida para uso interno, e para simular dados)
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
      product_variants (id, name, price, stock, image_url)
    `)
    .eq('store_id', storeId);

  if (productsError) {
    console.error("Erro ao buscar produtos:", productsError);
    throw new Error("Falha ao carregar produtos da loja.");
  }

  return productsData.map(product => mapSupabaseProductToFrontend(product, storeId));
};