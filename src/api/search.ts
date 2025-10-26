import { Product } from "../types/product";
import { supabase } from '@/integrations/supabase/client';

// Mock data para categorias (mantido, pois não temos uma tabela de categorias no Supabase)
const mockCategories = [
  { id: 1, nome: "Eletrónicos" },
  { id: 2, nome: "Moda" },
  { id: 3, nome: "Casa & Cozinha" },
  { id: 4, nome: "Saúde & Beleza" },
  { id: 5, nome: "Desporto" },
  { id: 6, nome: "Livros" },
  { id: 7, nome: "Bebés & Crianças" },
  { id: 8, nome: "Automóvel" },
  { id: 9, nome: "Serviços" },
  { id: 10, nome: "Outros" },
];

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

// Função para buscar categorias (mantida mockada)
export const getCategories = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockCategories;
};

// NOVA FUNÇÃO: Buscar contagem de produtos por categoria
export const getCategoryCounts = async (): Promise<Record<string, number>> => {
  // Usamos a função RPC 'count_products_by_category' se ela existisse,
  // mas como não existe, faremos uma consulta simples e agruparemos no cliente
  // ou usaremos a funcionalidade de contagem do Supabase (que é limitada para GROUP BY).
  
  // Vamos simular a contagem baseada nos produtos existentes para evitar consultas grandes:
  const { data, error } = await supabase
    .from('products')
    .select('category');
    
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
    const categoryName = mockCategories.find(c => c.id === parseInt(categoryId))?.nome;
    if (categoryName) {
      queryBuilder = queryBuilder.eq('category', categoryName);
    }
  }
  
  // Nota: Filtragem por preço e rating é complexa no Supabase sem views/funções
  // Vamos buscar e filtrar no cliente por enquanto, ou ignorar filtros complexos.
  // Por enquanto, apenas a busca por nome e categoria será feita no servidor.

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
  
  let filteredProducts = data.map(mapSupabaseProductToFrontend);

  // Filtragem por preço e rating (feita no cliente, pois o Supabase não suporta filtros complexos em joins aninhados facilmente)
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