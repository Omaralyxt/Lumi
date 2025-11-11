import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/context/CartContext'; // Necessário para tipagem de itens

// Tipagem para os dados de entrada da criação do pedido
interface OrderDataInput {
  items: CartItem[];
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string | null;
  };
  paymentMethod: string;
  deliveryInfo: {
    fee: number;
    eta: string;
  };
}

// Função auxiliar para mapear dados do Supabase para o tipo Order
const mapSupabaseOrderToFrontend = (order: any): Order => {
  // Mapeamento dos order_items
  const items: CartItem[] = (order.order_items || []).map((item: any) => ({
    id: item.id, // Usando o ID único da linha order_items como chave principal
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
 * Gera um número de pedido único (Mocked/Simples).
 */
const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const random = Math.floor(1000 + Math.random() * 9000); // 4 dígitos
  return `LMI-${dateStr}-${random}`;
};


/**
 * Cria um novo pedido no banco de dados.
 */
export const createOrder = async (data: OrderDataInput): Promise<Order> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado.');
  
  const orderNumber = generateOrderNumber();
  
  // 1. Inserir o pedido principal (orders)
  const orderPayload = {
    buyer_id: user.id,
    buyer_name: data.shippingAddress.name,
    buyer_email: user.email,
    buyer_phone: data.shippingAddress.phone,
    buyer_address: data.shippingAddress.address,
    buyer_city: data.shippingAddress.city,
    buyer_country: 'Mozambique', // Default
    order_number: orderNumber,
    status: 'pending' as OrderStatus,
    payment_method: data.paymentMethod,
    payment_status: 'awaiting_payment' as PaymentStatus,
    total_amount: data.total,
    shipping_cost: data.deliveryInfo.fee,
    estimated_delivery: data.deliveryInfo.eta,
    // Nota: store_id é null aqui, pois é um pedido multi-loja (se for o caso).
    // Para simplificar, vamos assumir que o primeiro item define o store_id, 
    // mas o ideal seria criar um pedido por loja ou usar uma estrutura diferente.
    // Usaremos o store_id do primeiro item para satisfazer a FK (se houver apenas 1 loja)
    store_id: data.items[0]?.shop.id || null, 
  };

  const { data: newOrderData, error: orderError } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) {
    console.error("Error inserting order:", orderError);
    throw new Error(`Falha ao criar pedido principal: ${orderError.message}`);
  }
  
  const newOrderId = newOrderData.id;

  // 2. Inserir os itens do pedido (order_items)
  const itemPayloads = data.items.map(item => ({
    order_id: newOrderId,
    store_id: item.shop.id,
    product_id: item.id, // Usando o ID do produto/variante
    product_name: item.title,
    variant: item.options[0]?.values[0] || 'Padrão',
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemPayloads);

  if (itemsError) {
    console.error("Error inserting order items:", itemsError);
    // Nota: Em um sistema real, você faria um rollback do pedido principal aqui.
    throw new Error(`Falha ao inserir itens do pedido: ${itemsError.message}`);
  }
  
  // 3. Retornar o pedido completo (simulando a busca)
  const finalOrder: Order = {
    ...mapSupabaseOrderToFrontend({ ...newOrderData, order_items: itemPayloads }),
    id: newOrderId,
    orderNumber: orderNumber,
    total: data.total,
    shippingCost: data.deliveryInfo.fee,
    estimatedDelivery: data.deliveryInfo.eta,
    // Preencher campos de comprador que não estão no mapSupabaseOrderToFrontend
    buyerName: orderPayload.buyer_name,
    buyerEmail: orderPayload.buyer_email,
    buyerPhone: orderPayload.buyer_phone,
    buyerAddress: orderPayload.buyer_address,
    buyerCity: orderPayload.buyer_city,
    buyerCountry: orderPayload.buyer_country,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
  };

  return finalOrder;
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