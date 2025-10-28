import { Product } from "../types/product";
import { supabase } from '@/integrations/supabase/client';
import { getFlatCategories, getAllCategoryNames } from '@/constants/categories';

// Função auxiliar para mapear dados do Supabase para o tipo Product
const mapSupabaseProductToFrontend = (product: any): Product => {
  const variants = (product.product_variants || []).map((v: any) => ({
    id: v.id,
    name: v.name,
    price: v.price,
    stock: v.stock,
    image_url: v.image_url,
    options: {
      Variant: v.name, 
    },
  }));

  const initialVariant = variants[0];
  const basePrice = initialVariant ? initialVariant.price : 0;
  const baseStock = initialVariant ? initialVariant.stock : 0;
  
  // Extrair URLs de imagem da nova relação product_images
  const images = (product.product_images || [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((img: any) => img.image_url);
    
  const finalImages = images.length > 0 
    ? images 
    : (product.image_url ? [product.image_url] : ['/placeholder.svg']);

  const storeId = product.stores?.id || 'unknown';
  
  const options: { name: string; values: string[] }[] = [
    { name: "Variante", values: variants.map(v => v.name) }
  ];

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
    },
    stock: baseStock,
    category: product.category || 'Outros',
    features: [], // Mocked
    specifications: {}, // Mocked
    deliveryInfo: { city: 'Maputo', fee: 150, eta: '1-2 dias' }, // Mocked
    reviews: [], // Mocked
    qa: [], // Mocked
    images: finalImages,
    options: options, // Usando as variantes como opções
    variants: variants, // Adicionando todas as variantes
    timeDelivery: '2-5 dias úteis', // Mocked
  } as Product;
};

// Exportar mockProducts vazio, pois não será mais usado
export const mockProducts: Product[] = [];

// Função para buscar categorias (agora usa a lista fixa)
export const getCategories = async (): Promise<any[]> => {
  // Retorna a lista plana de categorias para selects
  return getFlatCategories();
};

// NOVA FUNÇÃO: Buscar contagem de produtos por categoria
export const getCategoryCounts = async (): Promise<Record<string, number>> => {
  // Busca a contagem de produtos agrupados por categoria
  const { data, error } = await supabase
    .from('products')
    .select('category', { count: 'exact' });
    
  if (error) {
    console.error("Erro ao buscar categorias para contagem:", error);
    return {};
  }
  
  const counts: Record<string, number> = {};
  data.forEach(product => {
    const category = product.category || 'Outros';
    counts[category] = (counts[category] || 0) + 1;
  });
  
  return counts;
};

// Função para buscar produtos (usando Supabase)
export const searchProducts = async (
  query: string,
  categoryId?: string,
  priceRange?: [number, number],
  minRating?: number
): Promise<Product[]> => {
  let queryBuilder = supabase
    .from('products')
    .select(`
      id, 
      name, 
      description, 
      image_url, 
      category,
      stores (id, name, active),
      product_variants (id, name, price, stock, image_url),
      product_images (image_url, sort_order)
    `);

  // Filtrar por query
  if (query.length >= 2) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`);
  }
  
  // Filtrar por categoria (usando o nome da categoria)
  if (categoryId) {
    // Busca o nome da categoria pelo ID (se o ID for usado)
    const categoryName = getFlatCategories().find(c => c.id === parseInt(categoryId))?.nome;
    if (categoryName) {
      queryBuilder = queryBuilder.eq('category', categoryName);
    }
  }
  
  const { data, error } = await queryBuilder;

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
  
  let filteredProducts = data.map(mapSupabaseProductToFrontend);

  // Filtragem por preço e rating (feita no cliente)
  if (priceRange && priceRange[1] > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  }
  
  if (minRating && minRating > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.rating >= minRating
    );
  }

  return filteredProducts;
};