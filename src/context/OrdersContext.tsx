"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Order } from '@/types/order';
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
      // Em um app real, isso faria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular dados de pedidos
      const mockOrders: Order[] = [
        {
          id: 'ORD-001234',
          orderDate: '2024-07-28T10:30:00Z',
          total: 12750,
          status: 'shipped',
          items: [
            {
              id: 1,
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
              options: [],
              rating: 4.5,
              reviewCount: 128,
              timeDelivery: "2-5 dias úteis",
            } as CartItem
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
        }
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      // 1. Inserir o pedido principal na tabela 'orders'
      // Nota: Assumimos que todos os itens no carrinho pertencem à mesma loja para simplificar o store_id.
      // Em um marketplace real, isso seria mais complexo (um pedido por loja ou um pedido mestre).
      // Usaremos o store_id do primeiro item como mock para o pedido principal.
      const storeId = orderData.items[0]?.shop.id;
      if (!storeId) {
        throw new Error("Carrinho vazio ou sem informações de loja.");
      }

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert({
          store_id: storeId,
          customer_id: user.id,
          total_amount: orderData.total,
          status: 'pending',
          payment_method: orderData.paymentMethod,
          // tracking_code e outros campos podem ser adicionados aqui
        })
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
        product_id: item.id, // Assumindo que item.id é o UUID do produto
        store_id: item.shop.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
        product_name: item.title,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) {
        console.error("Erro ao inserir itens do pedido:", itemsError);
        // Em um cenário real, você faria rollback do pedido principal aqui.
        throw new Error("Falha ao registrar itens do pedido.");
      }

      // 3. Construir o objeto Order para o frontend (usando dados do Supabase + dados locais)
      const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const newOrder: Order = {
        id: newOrderId,
        orderDate: orderResult.created_at,
        total: orderResult.total_amount,
        status: orderResult.status,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderResult.payment_method,
        estimatedDelivery: estimatedDelivery,
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