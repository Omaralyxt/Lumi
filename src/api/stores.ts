import { mockProducts } from './search';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

// Mock data para lojas (mantido para fallback e estrutura)
const mockStores = [
  {
    id: 1,
    name: "TechStore MZ",
    logo_url: "/placeholder.svg",
    rating: 4.7,
    products_count: 156,
    is_verified: true,
    description: "Loja especializada em eletrónicos e tecnologia de ponta.",
  },
  {
    id: 2,
    name: "ModaExpress",
    logo_url: "/placeholder.svg",
    rating: 4.5,
    products_count: 234,
    is_verified: true,
    description: "As últimas tendências da moda para toda a família.",
  },
  {
    id: 3,
    name: "CozinhaFeliz",
    logo_url: "/placeholder.svg",
    rating: 4.9,
    products_count: 89,
    is_verified: true,
    description: "Tudo para sua cozinha, dos utensílios aos eletrodomésticos.",
  },
  {
    id: 4,
    name: "Casa & Jardim",
    logo_url: "/placeholder.svg",
    rating: 4.3,
    products_count: 167,
    is_verified: false,
    description: "Decoração, móveis e jardinagem para o seu lar.",
  },
];

// Função para buscar lojas em destaque (mantida mockada)
export const getFeaturedStores = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockStores;
};

// Função para buscar lojas por busca (mantida mockada)
export const searchStores = async (query: string): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStores.filter(store => 
    store.name.toLowerCase().includes(query.toLowerCase()) ||
    store.description.toLowerCase().includes(query.toLowerCase())
  );
};

// Função para buscar uma loja por ID (usando Supabase)
export const getStoreById = async (id: string): Promise<any> => {
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, logo_url, description, is_verified:active') // Usando 'active' como 'is_verified' temporariamente
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new Error("Loja não encontrada");
  }
  
  // Mesclar com dados mockados se necessário, ou retornar o essencial
  return {
    ...data,
    rating: 4.5, // Mocked
    products_count: 100, // Mocked
    is_verified: data.is_verified,
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
      product_variants (price, stock)
    `)
    .eq('store_id', storeId);

  if (productsError) {
    console.error("Erro ao buscar produtos:", productsError);
    throw new Error("Falha ao carregar produtos da loja.");
  }

  // Mapear dados do Supabase para o tipo Product esperado pelo frontend
  const fetchedProducts: Product[] = productsData.map(product => {
    // Determinar preço e estoque a partir das variantes ou usar um valor padrão
    const variants = product.product_variants || [];
    const basePrice = variants.length > 0 ? variants[0].price : 1000; // Usar preço da primeira variante
    const baseStock = variants.length > 0 ? variants[0].stock : 10; // Usar estoque da primeira variante
    
    // Encontrar um produto mockado para preencher campos ausentes
    const mockProduct = mockProducts.find(p => p.title.includes(product.name)) || mockProducts[0];

    return {
      ...mockProduct, // Usar mock para preencher campos complexos (reviews, options, deliveryInfo, etc.)
      id: product.id,
      title: product.name,
      description: product.description || mockProduct.description,
      price: basePrice,
      stock: baseStock,
      category: product.category || mockProduct.category,
      images: product.image_url ? [product.image_url] : mockProduct.images,
      shop: {
        ...mockProduct.shop,
        id: storeId, // Garantir que o ID da loja seja o correto
      },
      // Manter rating e reviewCount mockados por enquanto
    } as Product;
  });

  return fetchedProducts;
};