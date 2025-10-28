"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

// Mock context dependencies (assuming they will be created later)
const useCart = () => ({ cartCount: 0 }); 

export default function HeaderCart() {
  const { cartCount } = useCart();

  return (
    <Link to="/cart">
      <Button variant="ghost" size="sm" className="relative p-2">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>
    </Link>
  );
}