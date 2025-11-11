"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Order } from '@/types/order';
import { getBuyerOrders } from '@/api/orders';
import { useAuth } from '@/hooks/useAuth';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

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

  return (
    <OrdersContext.Provider value={{ orders, loading, error, fetchOrders }}>
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