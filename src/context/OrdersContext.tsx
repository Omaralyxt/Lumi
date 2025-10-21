"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Order } from '@/types/order';
import { toast } from "sonner";

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: any) => Promise<Order>;
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
              shop: { name: "TechStore MZ", rating: 4.7, reviewCount: 342, isVerified: true },
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
            }
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

  const createOrder = async (orderData: any): Promise<Order> => {
    setLoading(true);
    try {
      // Em um app real, isso enviaria os dados para a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        total: orderData.total,
        status: 'pending',
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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