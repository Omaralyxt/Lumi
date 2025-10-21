import { mockProducts } from './search';

// Mock data para lojas
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

// Função para buscar lojas em destaque
export const getFeaturedStores = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockStores;
};

// Função para buscar lojas por busca
export const searchStores = async (query: string): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStores.filter(store => 
    store.name.toLowerCase().includes(query.toLowerCase()) ||
    store.description.toLowerCase().includes(query.toLowerCase())
  );
};

// Função para buscar uma loja por ID
export const getStoreById = async (id: number): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const store = mockStores.find(s => s.id === id);
  if (!store) {
    throw new Error("Loja não encontrada");
  }
  return store;
};

// Função para buscar produtos de uma loja específica
export const getProductsByStoreId = async (storeId: number): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const store = mockStores.find(s => s.id === storeId);
  if (!store) {
    return [];
  }
  return mockProducts.filter(p => p.shop.name === store.name);
};