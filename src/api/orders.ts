import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/context/CartContext'; // Necessário para tipagem de itens

// Função auxiliar para mapear dados do Supabase para o tipo Order
const mapSupabaseOrderToFrontend = (order: any): Order => {
  // Mapeamento dos order_items
  const items: CartItem[] = (order.order_items || []).map((item: any) => ({
    id: item.product_id, // Usamos o ID do produto como ID do item (simplificação)
    title: item.product_name,
    price: item.price,
    quantity: item.quantity,
    stock: 100, // Mocked stock
    category: 'Outros', // Mocked category
    description: 'N/A', // Mocked
    features: [], // Mocked
    specifications: {}, // Mocked
    deliveryInfo: { city: order.buyer_city, fee: order.shipping_cost, eta: order.estimated_delivery },
    reviews: [],
    qa: [],
    images: ['/placeholder.svg'], // Imagem mockada, idealmente buscaríamos a imagem do produto
    options: [{ name: "Variante", values: [item.variant || 'Padrão'] }],
    variants: [],
    rating: 4.5,
    reviewCount: 0,
    timeDelivery: order.estimated_delivery,
    shop: {
      id: item.store_id,
      name: 'Loja Desconhecida', // Não temos o nome da loja aqui, precisaria de JOIN ou RPC
      rating: 4.5,
      reviewCount: 0,
      isVerified: true,
    }
  }));

  return {
    id: order.id,
    orderDate: order.created_at,
    total: order.total_amount,
    status: order.status as OrderStatus,
    paymentStatus: order.payment_status as PaymentStatus,
    orderNumber: order.order_number,
    shippingCost: order.shipping_cost,
    items: items,
    buyerName: order.buyer_name,
    buyerEmail: order.buyer_email,
    buyerPhone: order.buyer_phone,
    buyerAddress: order.buyer_address,
    buyerCity: order.buyer_city,
    buyerCountry: order.buyer_country,
    shippingAddress: {
      name: order.buyer_name,
      phone: order.buyer_phone,
      address: order.buyer_address,
      city: order.buyer_city,
      district: 'N/A', // Não temos distrito na tabela orders
    },
    paymentMethod: order.payment_method,
    estimatedDelivery: order.estimated_delivery,
  };
};

/**
 * Busca todos os pedidos do comprador logado.
 */
export const getBuyerOrders = async (): Promise<Order[]> => {
  console.log("API: Attempting to fetch user and orders...");
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("API: User not authenticated.");
    throw new Error("Usuário não autenticado.");
  }
  
  console.log(`API: User authenticated. Fetching orders for ID: ${user.id}`);

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("API: Erro ao buscar pedidos do comprador:", error);
    throw new Error(`Falha ao carregar pedidos: ${error.message}`);
  }
  
  if (!data) {
    console.log("API: No orders data returned.");
    return [];
  }
  
  console.log(`API: Successfully fetched ${data.length} raw orders. Mapping to frontend format.`);

  try {
    return data.map(mapSupabaseOrderToFrontend);
  } catch (mapError) {
    console.error("API: Erro durante o mapeamento dos pedidos:", mapError);
    // Lançar um erro específico para que o contexto possa capturá-lo
    throw new Error("Erro de processamento de dados do pedido.");
  }
};

// Mantido para compatibilidade, mas não usado no fluxo do comprador
export const getSellerOrders = async (sellerId: string): Promise<Order[]> => {
  // Implementação real para vendedores seria necessária aqui
  return [];
};

// Mantido para compatibilidade, mas a atualização de status deve ser feita via API/Webhook
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
  throw new Error("A atualização de status deve ser feita via API ou Webhook.");
};