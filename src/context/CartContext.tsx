"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';
import { toast } from "sonner";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  deliveryFee: number;
  getDeliveryInfo: (city: string) => { fee: number; eta: string };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      setCartItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Apenas ${product.stock} unidades disponíveis.`);
          return prevItems;
        }
        toast.success(`${quantity}x ${product.title} adicionado ao carrinho.`);
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        toast.success(`${quantity}x ${product.title} adicionado ao carrinho.`);
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.title} removido do carrinho.`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item.id === productId);
      if (itemToUpdate && quantity > itemToUpdate.stock) {
        toast.error(`Apenas ${itemToUpdate.stock} unidades disponíveis.`);
        return prevItems;
      }
      if (quantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Carrinho esvaziado.");
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Calcular frete baseado na cidade do primeiro item
  const getDeliveryInfo = (city: string) => {
    const deliveryFees: Record<string, { fee: number; eta: string }> = {
      "Maputo": { fee: 150, eta: "1-2 dias" },
      "Matola": { fee: 200, eta: "2-3 dias" },
      "Beira": { fee: 300, eta: "3-4 dias" },
      "Nampula": { fee: 350, eta: "4-5 dias" },
      "Nacala": { fee: 400, eta: "5-6 dias" },
      "default": { fee: 250, eta: "3-5 dias" }
    };
    
    return deliveryFees[city] || deliveryFees.default;
  };
  
  const deliveryFee = cartItems.length > 0 ? getDeliveryInfo(cartItems[0].deliveryInfo.city).fee : 0;
  const cartTotal = cartSubtotal + deliveryFee;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      cartSubtotal,
      cartTotal,
      deliveryFee,
      getDeliveryInfo
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};