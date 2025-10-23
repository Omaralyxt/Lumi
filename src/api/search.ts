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
  const variants = product.product_variants || [];
  const basePrice = variants.length > 0 ? variants[0].price : 0;
  const baseStock = variants.length > 0 ? variants[0].stock : 0;

  const storeId = product.stores?.id || 'unknown';

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
    images: product.image_url ? [product.image_url] : ['/placeholder.svg'],
    options: [], // Mocked
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
      product_variants (price, stock)
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

// Função para buscar lojas (usando Supabase - re-exportando de stores.ts)
export { searchStores } from './stores';