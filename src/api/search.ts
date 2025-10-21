import { Product } from "../types/product";

// Mock data para categorias
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

// Mock data para produtos (exportado para ser usado em outras partes da API)
export const mockProducts: Product[] = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    description: "Smartphone com tela AMOLED de 6.4 polegadas, processador octa-core, 128GB de armazenamento, 6GB RAM, câmera tripla de 50MP, bateria de 5000mAh.",
    price: 12500,
    originalPrice: 15000,
    rating: 4.5,
    reviewCount: 128,
    shop: {
      name: "TechStore MZ",
      rating: 4.7,
      reviewCount: 342,
      isVerified: true,
    },
    stock: 15,
    category: "Eletrónicos",
    features: [
      "Tela AMOLED 6.4\"",
      "Processador Octa-core",
      "128GB Armazenamento",
      "6GB RAM",
      "Câmera Tripla 50MP",
      "Bateria 5000mAh",
      "5G",
    ],
    specifications: {
      "Marca": "Samsung",
      "Modelo": "Galaxy A54 5G",
      "Cor": "Preto",
      "Armazenamento": "128GB",
      "RAM": "6GB",
      "Tela": "6.4\" AMOLED",
      "Câmera Traseira": "50MP + 12MP + 5MP",
      "Câmera Frontal": "32MP",
      "Bateria": "5000mAh",
      "Sistema Operativo": "Android 13",
    },
    deliveryInfo: {
      city: "Maputo",
      fee: 150,
      eta: "1-2 dias",
    },
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "Excelente produto, entrega rápida e em perfeito estado!",
        author: "João Silva",
        date: "2 dias atrás",
      },
      {
        id: 2,
        rating: 4,
        comment: "Bom smartphone, só a bateria poderia durar um pouco mais.",
        author: "Maria Santos",
        date: "1 semana atrás",
      },
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    options: [
      {
        name: "Cor",
        values: ["Preto", "Branco", "Azul"]
      },
      {
        name: "Armazenamento",
        values: ["128GB", "256GB"]
      }
    ],
    timeDelivery: "2-5 dias úteis",
  },
  {
    id: 2,
    title: "Tênis Esportivo Nike Air Max",
    description: "Tênis esportivo com tecnologia Air Max, ideal para corrida e uso diário. Conforto e estilo em um só produto.",
    price: 2500,
    originalPrice: 3500,
    rating: 4.2,
    reviewCount: 89,
    shop: {
      name: "ModaExpress",
      rating: 4.5,
      reviewCount: 234,
      isVerified: true,
    },
    stock: 25,
    category: "Moda",
    features: [
      "Tecnologia Air Max",
      "Material respirável",
      "Sola antiderrapante",
      "Design moderno",
    ],
    specifications: {
      "Marca": "Nike",
      "Modelo": "Air Max",
      "Cor": "Preto/Branco",
      "Tamanho": "38-45",
      "Material": "Sintético",
    },
    deliveryInfo: {
      city: "Maputo",
      fee: 100,
      eta: "1-2 dias",
    },
    reviews: [
      {
        id: 3,
        rating: 5,
        comment: "Tênis muito confortável, uso para corrida todos os dias!",
        author: "Carlos Mendes",
        date: "3 dias atrás",
      },
    ],
    images: ["/placeholder.svg", "/placeholder.svg"],
    options: [
      {
        name: "Tamanho",
        values: ["38", "39", "40", "41", "42", "43", "44", "45"]
      },
      {
        name: "Cor",
        values: ["Preto/Branco", "Azul/Branco", "Vermelho/Branco"]
      }
    ],
    timeDelivery: "2-3 dias úteis",
  },
  {
    id: 3,
    title: "Panela de Pressão Inox",
    description: "Panela de pressão em aço inox de alta qualidade, capacidade de 6 litros, ideal para cozinhas profissionais.",
    price: 1800,
    originalPrice: 2200,
    rating: 4.8,
    reviewCount: 156,
    shop: {
      name: "CozinhaFeliz",
      rating: 4.9,
      reviewCount: 412,
      isVerified: true,
    },
    stock: 8,
    category: "Casa & Cozinha",
    features: [
      "Aço inox 304",
      "Capacidade 6L",
      "Indução compatível",
      "Segurança avançada",
    ],
    specifications: {
      "Marca": "CozinhaFeliz",
      "Modelo": "Premium 6L",
      "Material": "Aço Inox 304",
      "Capacidade": "6 Litros",
      "Compatibilidade": "Indução, Gás, Elétrico",
    },
    deliveryInfo: {
      city: "Maputo",
      fee: 80,
      eta: "2-3 dias",
    },
    reviews: [
      {
        id: 4,
        rating: 5,
        comment: "Excelente panela, cozinha rápido e seguro!",
        author: "Ana Pereira",
        date: "1 semana atrás",
      },
    ],
    images: ["/placeholder.svg", "/placeholder.svg"],
    options: [
      {
        name: "Tamanho",
        values: ["4L", "6L", "8L"]
      }
    ],
    timeDelivery: "3-5 dias úteis",
  },
  {
    id: 4,
    title: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com cancelamento de ruído, bateria de longa duração e som de alta qualidade.",
    price: 1999,
    originalPrice: 2800,
    rating: 4.3,
    reviewCount: 67,
    shop: {
      name: "TechStore MZ",
      rating: 4.7,
      reviewCount: 342,
      isVerified: true,
    },
    stock: 12,
    category: "Eletrónicos",
    features: [
      "Cancelamento de ruído",
      "Bateria 30h",
      "Bluetooth 5.0",
      "Microfone integrado",
    ],
    specifications: {
      "Marca": "SoundMax",
      "Modelo": "Pro X",
      "Autonomia": "30 horas",
      "Conectividade": "Bluetooth 5.0",
      "Cor": "Preto",
    },
    deliveryInfo: {
      city: "Maputo",
      fee: 120,
      eta: "1-2 dias",
    },
    reviews: [
      {
        id: 5,
        rating: 4,
        comment: "Ótimo som, cancelamento de ruído funciona bem!",
        author: "João Silva",
        date: "5 dias atrás",
      },
    ],
    images: ["/placeholder.svg", "/placeholder.svg"],
    options: [
      {
        name: "Cor",
        values: ["Preto", "Branco", "Azul"]
      }
    ],
    timeDelivery: "2-4 dias úteis",
  },
  {
    id: 5,
    title: "Smartwatch Xiaomi Mi Band",
    description: "Smartwatch fitness com monitoramento de saúde, notificações e bateria de longa duração.",
    price: 1299,
    originalPrice: 1800,
    rating: 4.6,
    reviewCount: 234,
    shop: {
      name: "TechStore MZ",
      rating: 4.7,
      reviewCount: 342,
      isVerified: true,
    },
    stock: 20,
    category: "Eletrónicos",
    features: [
      "Monitoramento cardíaco",
      "GPS integrado",
      "Resistente à água",
      "Bateria 14 dias",
    ],
    specifications: {
      "Marca": "Xiaomi",
      "Modelo": "Mi Band 7",
      "Tela": "AMOLED 1.62\"",
      "Bateria": "14 dias",
      "Resistência": "5ATM",
    },
    deliveryInfo: {
      city: "Maputo",
      fee: 100,
      eta: "1-2 dias",
    },
    reviews: [
      {
        id: 6,
        rating: 5,
        comment: "Excelente custo-benefício, monitoramento preciso!",
        author: "Maria Santos",
        date: "1 semana atrás",
      },
    ],
    images: ["/placeholder.svg", "/placeholder.svg"],
    options: [
      {
        name: "Cor",
        values: ["Preto", "Azul", "Rosa"]
      }
    ],
    timeDelivery: "2-3 dias úteis",
  },
];

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

// Função para buscar categorias
export const getCategories = async (): Promise<any[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockCategories;
};

// Função para buscar produtos
export const searchProducts = async (
  query: string,
  categoryId?: string,
  priceRange?: [number, number],
  minRating?: number
): Promise<any[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredProducts = [...mockProducts];
  
  // Filtrar por query
  if (query.length >= 2) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.shop.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Filtrar por categoria
  if (categoryId) {
    filteredProducts = filteredProducts.filter(product =>
      product.category === mockCategories.find(c => c.id === parseInt(categoryId))?.nome
    );
  }
  
  // Filtrar por faixa de preço
  if (priceRange && priceRange[1] > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  }
  
  // Filtrar por avaliação mínima
  if (minRating && minRating > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.rating >= minRating
    );
  }
  
  return filteredProducts;
};

// Função para buscar lojas
export const searchStores = async (query: string): Promise<any[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockStores.filter(store =>
    store.name.toLowerCase().includes(query.toLowerCase()) ||
    store.description.toLowerCase().includes(query.toLowerCase())
  );
};