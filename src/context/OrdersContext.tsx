"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Order, PaymentStatus } from '@/types/order';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from './CartContext';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: {
    items: CartItem[];
    total: number;
    shippingAddress: any; // Usando 'any' temporariamente, idealmente ShippingAddress
    paymentMethod: string;
    deliveryInfo: { fee: number; eta: string };
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Helper function to generate a unique order number (LMI-YYYYMMDD-XXXX)
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 random digits
  return `LMI-${year}${month}${day}-${randomSuffix}`;
};

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar pedidos do localStorage (em um app real, viria da API)
  useEffect(() => {
    // Em um ambiente real, fetchOrders seria chamado aqui para carregar pedidos do usuário logado.
    // Por enquanto, mantemos o mock/localStorage para inicialização rápida.
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  // Salvar pedidos no localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de fetch de pedidos (mantida para compatibilidade)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um app real, buscaríamos orders e order_items do Supabase aqui.
      
      // Manter mock para evitar que a página de histórico quebre se não houver dados
      const mockOrders: Order[] = [
        {
          id: 'ORD-001234',
          orderDate: '2024-07-28T10:30:00Z',
          total: 12750,
          status: 'shipped',
          paymentStatus: 'paid',
          orderNumber: 'LMI-20240728-1234',
          shippingCost: 250,
          items: [
            {
              id: 'mock-prod-1',
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
              reviews: [], // Adicionado
              qa: [], // Adicionado
              options: [],
              variants: [], // Adicionado
              rating: 4.5,
              reviewCount: 128,
              timeDelivery: "2-5 dias úteis",
            } as CartItem
          ],
          buyerName: "João Silva",
          buyerEmail: "joao@email.com",
          buyerPhone: "+258 82 123 4567",
          buyerAddress: "Av. Kenneth Kaunda, 123",
          buyerCity: "Maputo",
          buyerCountry: "Mozambique",
          shippingAddress: {
            name: "João Silva",
            phone: "+258 82 123 4567",
            address: "Av. Kenneth Kaunda, 123",
            city: "Maputo",
            district: "KaMubukwana",
          },
          paymentMethod: "M-Pesa",
          estimatedDelivery: "2024-07-30",
        } as Order
      ];
      
      setOrders(mockOrders);
    } catch (err) {
      setError("Falha ao carregar pedidos");
      toast.error("Falha ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    items: CartItem[];
    total: number;
    shippingAddress: any;
    paymentMethod: string;
    deliveryInfo: { fee: number; eta: string };
  }): Promise<Order> => {
    setLoading(true);
    
    // Usamos uma transação simulada no cliente, mas o Supabase fará a transação real
    // se usarmos uma função RPC, o que não estamos fazendo aqui.
    // Portanto, faremos as inserções sequencialmente e lidaremos com erros.
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }
      
      const orderNumber = generateOrderNumber();
      const firstItem = orderData.items[0];
      const storeId = firstItem?.shop.id;
      
      if (!storeId) {
        throw new Error("Carrinho vazio ou sem informações de loja.");
      }
      
      // 1. Inserir o pedido principal na tabela 'orders'
      const orderPayload = {
        buyer_id: user.id,
        buyer_name: orderData.shippingAddress.name,
        buyer_email: user.email, // Assumindo que o email está no perfil de auth
        buyer_phone: orderData.shippingAddress.phone,
        buyer_address: orderData.shippingAddress.address,
        buyer_city: orderData.shippingAddress.city,
        buyer_country: 'Mozambique', // Default
        order_number: orderNumber,
        status: 'pending',
        payment_method: orderData.paymentMethod,
        payment_status: 'awaiting_payment' as PaymentStatus,
        total_amount: orderData.total,
        shipping_cost: orderData.deliveryInfo.fee,
        estimated_delivery: orderData.deliveryInfo.eta,
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderError || !orderResult) {
        console.error("Erro ao inserir pedido:", orderError);
        throw new Error("Falha ao criar pedido no banco de dados.");
      }

      const newOrderId = orderResult.id;
      
      // 2. Inserir os itens do pedido na tabela 'order_items'
      const orderItemsPayload = orderData.items.map(item => ({
        order_id: newOrderId,
        product_id: item.id, 
        store_id: item.shop.id,
        product_name: item.title,
        variant: item.options.length > 0 ? item.options.map(o => `${o.name}: ${o.values[0]}`).join(', ') : null, // Simulação de variante
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) {
        console.error("Erro ao inserir itens do pedido:", itemsError);
        // Em um cenário real, você faria rollback do pedido principal aqui.
        throw new Error("Falha ao registrar itens do pedido.");
      }
      
      // 3. Criar notificação para o vendedor
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          store_id: storeId,
          order_id: newOrderId,
          type: 'new_order',
          title: 'Novo pedido recebido',
          message: `Você recebeu um novo pedido de ${orderPayload.buyer_name} (${orderData.items.length} itens).`,
        });
        
      if (notificationError) {
        console.error("Erro ao criar notificação:", notificationError);
        // Não lançamos erro fatal, pois o pedido já foi criado.
      }

      // 4. Construir o objeto Order para o frontend
      const newOrder: Order = {
        id: newOrderId,
        orderDate: orderResult.created_at,
        total: orderResult.total_amount,
        status: orderResult.status as Order['status'],
        paymentStatus: orderResult.payment_status as PaymentStatus,
        orderNumber: orderResult.order_number,
        shippingCost: orderResult.shipping_cost,
        items: orderData.items,
        buyerName: orderResult.buyer_name,
        buyerEmail: orderResult.buyer_email,
        buyerPhone: orderResult.buyer_phone,
        buyerAddress: orderResult.buyer_address,
        buyerCity: orderResult.buyer_city,
        buyerCountry: orderResult.buyer_country,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderResult.payment_method,
        estimatedDelivery: orderResult.estimated_delivery,
      };
      
      setOrders(prev => [newOrder, ...prev]);
      toast.success("Pedido criado com sucesso!");
      return newOrder;
    } catch (err) {
      toast.error("Falha ao criar pedido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setLoading(true);
    try {
      // Em um app real, isso enviaria a atualização para a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      toast.success(`Status do pedido atualizado para ${status}`);
    } catch (err) {
      toast.error("Falha ao atualizar status do pedido");
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      loading, 
      error, 
      fetchOrders, 
      createOrder, 
      updateOrderStatus,
      getOrderById
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};