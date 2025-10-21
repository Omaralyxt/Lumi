// Mock data para lojas
const mockStores = [
  {
    id: 1,
    name: "TechStore MZ",
    logo_url: "/placeholder.svg",
    rating: 4.7,
    products_count: 156,
    is_verified: true,
    description: "Loja especializada em eletrónicos e tecnologia",
  },
  {
    id: 2,
    name: "ModaExpress",
    logo_url: "/placeholder.svg",
    rating: 4.5,
    products_count: 234,
    is_verified: true,
    description: "Moda e acessórios para toda a família",
  },
  {
    id: 3,
    name: "CozinhaFeliz",
    logo_url: "/placeholder.svg",
    rating: 4.9,
    products_count: 89,
    is_verified: true,
    description: "Utensílios e eletrodomésticos para cozinha",
  },
  {
    id: 4,
    name: "Casa & Jardim",
    logo_url: "/placeholder.svg",
    rating: 4.3,
    products_count: 167,
    is_verified: false,
    description: "Produtos para decoração e jardinagem",
  },
];

// Função para buscar lojas em destaque
export const getFeaturedStores = async (): Promise<any[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return mockStores;
};

// Função para buscar lojas por busca
export const searchStores = async (query: string): Promise<any[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockStores.filter(store => 
    store.name.toLowerCase().includes(query.toLowerCase()) ||
    store.description.toLowerCase().includes(query.toLowerCase())
  );
};