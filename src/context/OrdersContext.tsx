"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Order } from '@/types/order';
import { getBuyerOrders, createOrder as createOrderApi } from '@/api/orders';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { CartItem } from './CartContext'; // Importar CartItem para tipagem

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

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (data: OrderDataInput) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined; // Adicionando getOrderById
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Mutação para criar o pedido
  const createOrderMutation = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (newOrder) => {
      // Adiciona o novo pedido ao topo da lista
      setOrders(prev => [newOrder, ...prev]);
    },
  });

  // Função exposta para criar o pedido
  const createOrder = useCallback(async (data: OrderDataInput): Promise<Order> => {
    return createOrderMutation.mutateAsync(data);
  }, [createOrderMutation]);


  // Memoize fetchOrders using useCallback to ensure stability
  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const fetchedOrders = await getBuyerOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao carregar os pedidos.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]); // Dependency on isAuthenticated ensures it runs when auth state changes

  // Função para buscar um pedido pelo ID no estado local
  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      loading, 
      error, 
      fetchOrders,
      createOrder,
      getOrderById, // Expondo a função
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