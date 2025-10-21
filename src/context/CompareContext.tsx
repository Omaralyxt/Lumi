"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  isInCompare: (productId: number) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 4;

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem('compareItems');
    if (storedItems) {
      setCompareItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product: Product) => {
    setCompareItems(prevItems => {
      if (prevItems.length >= MAX_COMPARE_ITEMS) {
        alert(`Você pode comparar no máximo ${MAX_COMPARE_ITEMS} produtos.`);
        return prevItems;
      }
      if (prevItems.find(item => item.id === product.id)) {
        return prevItems; // Já está na lista
      }
      return [...prevItems, product];
    });
  };

  const removeFromCompare = (productId: number) => {
    setCompareItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isInCompare = (productId: number) => {
    return compareItems.some(item => item.id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};