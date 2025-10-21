import { Product, Review } from "../types/product";

// Mock data para produtos
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    description: "Smartphone com tela AMOLED de 6.4 polegadas, processador octa-core, 128GB de armazenamento, 6GB RAM, câmera tripla de 50MP, bateria de 5000mAh.",
    price: 12500,
    originalPrice: 15000,
    rating: 4.2,
    reviewCount: 3,
    shop: {
      name: "TechStore MZ",
      rating: 4.7,
      reviewCount: 342,
      isVerified: true,
      memberSince: "2022",
      productCount: 156,
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
        comment: "Excelente produto, entrega rápida e em perfeito estado! As fotos não fazem jus à qualidade da tela.",
        author: "João Silva",
        date: "2 dias atrás",
        verifiedPurchase: true,
        images: ["/placeholder.svg"]
      },
      {
        id: 2,
        rating: 4,
        comment: "Bom smartphone, só a bateria poderia durar um pouco mais. No geral, estou satisfeito.",
        author: "Maria Santos",
        date: "1 semana atrás",
        verifiedPurchase: true,
      },
      {
        id: 3,
        rating: 3,
        comment: "É um bom aparelho, mas esperava mais pelo preço. A câmera em baixa luz não é tão boa.",
        author: "Pedro Costa",
        date: "2 semanas atrás",
        verifiedPurchase: false,
      }
    ],
    qa: [
      {
        id: 1,
        question: "Este telemóvel tem garantia?",
        answer: "Sim, todos os nossos produtos eletrónicos vêm com uma garantia padrão de 1 ano contra defeitos de fabrico.",
        author: "Carlos Mendes",
        date: "3 dias atrás",
      },
      {
        id: 2,
        question: "A entrega para a Matola tem custos?",
        answer: "Sim, a taxa de entrega para a Matola é de 250 MT. O frete é grátis para compras acima de 5000 MT na cidade de Maputo.",
        author: "Vendedor (TechStore MZ)",
        date: "1 dia atrás",
      }
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
  // ... (restante dos produtos)
];

// (O resto do arquivo permanece o mesmo)
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

// Função para submeter uma nova avaliação
export const submitReview = async (
  productId: number, 
  reviewData: Omit<Review, 'id' | 'author' | 'date'>
): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const productIndex = mockProducts.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    throw new Error("Produto não encontrado");
  }

  const newReview: Review = {
    ...reviewData,
    id: Date.now(),
    author: "Utilizador Anónimo", // Simulado
    date: "agora mesmo",
  };

  const product = mockProducts[productIndex];
  product.reviews.unshift(newReview); // Adicionar no início
  product.reviewCount++;
  
  // Recalcular a avaliação média
  const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = totalRating / product.reviewCount;

  return product;
};