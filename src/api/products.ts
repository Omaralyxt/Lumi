import { Product } from "../types/product";

// Mock data para produtos
const mockProducts: Product[] = [
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
        comment: "Excelente panela, cozinha rápido e segura!",
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

// Função para buscar produto por ID
export const getProductById = async (id: string): Promise<Product> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const product = mockProducts.find(p => p.id === parseInt(id));
  if (!product) {
    throw new Error("Produto não encontrado");
  }
  return product;
};

// Função para buscar produtos similares
export const getSimilarProducts = async (category: string, excludeId?: number): Promise<Product[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockProducts
    .filter(p => p.category === category && p.id !== excludeId)
    .slice(0, 4); // Limitar a 4 produtos similares
};

// Função para buscar todos os produtos
export const getAllProducts = async (): Promise<Product[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockProducts;
};

// Função para buscar produtos por categoria
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return mockProducts.filter(p => p.category === category);
};

// Função para buscar produtos em destaque
export const getFeaturedProducts = async (): Promise<Product[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockProducts
    .filter(p => p.originalPrice && p.stock > 0)
    .slice(0, 6); // Limitar a 6 produtos em destaque
};