import { Order } from '@/types/order';

const mockOrders: Order[] = [
  {
    id: 'ORD-001234',
    orderDate: '2024-07-28T10:30:00Z',
    total: 12750,
    status: 'shipped',
    paymentStatus: 'paid', // Adicionado
    orderNumber: 'LMI-20240728-1234', // Adicionado
    shippingCost: 250, // Adicionado
    buyerName: "João Silva", // Adicionado
    buyerEmail: "joao.silva@example.com", // Adicionado
    buyerPhone: "+258 82 123 4567", // Adicionado
    buyerAddress: "Av. Kenneth Kaunda, 123", // Adicionado
    buyerCity: "Maputo", // Adicionado
    buyerCountry: "Mozambique", // Adicionado
    items: [
      {
        id: 'mock-prod-1', // Alterado para string
        title: "Smartphone Samsung Galaxy A54 5G",
        price: 12500,
        images: ["/placeholder.svg"],
        shop: { id: 'mock-store-1', name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
        quantity: 1,
        stock: 15,
        category: "Eletrónicos",
        description: "",
        features: [],
        specifications: {},
        deliveryInfo: { city: "Maputo", fee: 150, eta: "1-2 dias" },
        reviews: [],
        qa: [], // Adicionado
        options: [],
        variants: [], // Adicionado
        rating: 4.5,
        reviewCount: 128,
        timeDelivery: "2-5 dias úteis",
      } as any // Usando 'as any' para simplificar o mock de CartItem
    ],
    shippingAddress: {
      name: "João Silva",
      phone: "+258 82 123 4567",
      address: "Av. Kenneth Kaunda, 123",
      city: "Maputo",
      district: "KaMubukwana",
    },
    paymentMethod: "M-Pesa",
    estimatedDelivery: "2024-07-30",
  },
  {
    id: 'ORD-001233',
    orderDate: '2024-07-25T15:00:00Z',
    total: 4550,
    status: 'delivered',
    paymentStatus: 'paid', // Adicionado
    orderNumber: 'LMI-20240725-1233', // Adicionado
    shippingCost: 200, // Adicionado
    buyerName: "João Silva", // Adicionado
    buyerEmail: "joao.silva@example.com", // Adicionado
    buyerPhone: "+258 82 123 4567", // Adicionado
    buyerAddress: "Av. Kenneth Kaunda, 123", // Adicionado
    buyerCity: "Maputo", // Adicionado
    buyerCountry: "Mozambique", // Adicionado
    items: [
      {
        id: 'mock-prod-2', // Alterado para string
        title: "Tênis Esportivo Nike Air Max",
        price: 2500,
        images: ["/placeholder.svg"],
        shop: { id: 'mock-store-2', name: "ModaExpress", rating: 4.5, reviewCount: 234, isVerified: true },
        quantity: 1,
        stock: 25,
        category: "Moda",
        description: "",
        features: [],
        specifications: {},
        deliveryInfo: { city: "Maputo", fee: 100, eta: "1-2 dias" },
        reviews: [],
        qa: [], // Adicionado
        options: [],
        variants: [], // Adicionado
        rating: 4.2,
        reviewCount: 89,
        timeDelivery: "2-3 dias úteis",
      } as any,
      {
        id: 'mock-prod-3', // Alterado para string
        title: "Panela de Pressão Inox",
        price: 1800,
        images: ["/placeholder.svg"],
        shop: { id: 'mock-store-3', name: "CozinhaFeliz", rating: 4.9, reviewCount: 412, isVerified: true },
        quantity: 1,
        stock: 8,
        category: "Casa & Cozinha",
        description: "",
        features: [],
        specifications: {},
        deliveryInfo: { city: "Maputo", fee: 80, eta: "2-3 dias" },
        reviews: [],
        qa: [], // Adicionado
        options: [],
        variants: [], // Adicionado
        rating: 4.8,
        reviewCount: 156,
        timeDelivery: "3-5 dias úteis",
      } as any
    ],
    shippingAddress: {
      name: "João Silva",
      phone: "+258 82 123 4567",
      address: "Av. Kenneth Kaunda, 123",
      city: "Maputo",
      district: "KaMubukwana",
    },
    paymentMethod: "Cartão de Crédito",
    estimatedDelivery: "2024-07-27",
  },
  {
    id: 'ORD-001232',
    orderDate: '2024-07-29T08:00:00Z',
    total: 2249,
    status: 'pending',
    paymentStatus: 'awaiting_payment', // Adicionado
    orderNumber: 'LMI-20240729-1232', // Adicionado
    shippingCost: 250, // Adicionado
    buyerName: "João Silva", // Adicionado
    buyerEmail: "joao.silva@example.com", // Adicionado
    buyerPhone: "+258 82 123 4567", // Adicionado
    buyerAddress: "Rua dos Heróis de Mueda, 456", // Adicionado
    buyerCity: "Maputo", // Adicionado
    buyerCountry: "Mozambique", // Adicionado
    items: [
      {
        id: 'mock-prod-4', // Alterado para string
        title: "Fone de Ouvido Bluetooth",
        price: 1999,
        images: ["/placeholder.svg"],
        shop: { id: 'mock-store-1', name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
        quantity: 1,
        stock: 12,
        category: "Eletrónicos",
        description: "",
        features: [],
        specifications: {},
        deliveryInfo: { city: "Maputo", fee: 120, eta: "1-2 dias" },
        reviews: [],
        qa: [], // Adicionado
        options: [],
        variants: [], // Adicionado
        rating: 4.3,
        reviewCount: 67,
        timeDelivery: "2-4 dias úteis",
      } as any
    ],
    shippingAddress: {
      name: "João Silva",
      phone: "+258 82 123 4567",
      address: "Rua dos Heróis de Mueda, 456",
      city: "Maputo",
      district: "Malhangalene",
    },
    paymentMethod: "eMola",
    estimatedDelivery: "2024-08-01",
  }
];

export const getBuyerOrders = async (userId: string): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockOrders;
};

export const getSellerOrders = async (sellerId: string): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockOrders.filter(order => order.items.some(item => item.shop.name === "TechStore MZ")); // Simulação
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const orderIndex = mockOrders.findIndex(o => o.id === orderId);
  if (orderIndex > -1) {
    mockOrders[orderIndex].status = status;
    return mockOrders[orderIndex];
  }
  throw new Error("Pedido não encontrado");
};