"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "@/context/CartContext";
import { OrderStatus } from "@/types/order";
import { Button } from "./ui/button";

interface OrderItemCardProps {
  item: CartItem;
  orderStatus: OrderStatus;
}

export default function OrderItemCard({ item, orderStatus }: OrderItemCardProps) {
  // O ID do item aqui é o ID da linha order_items (UUID), usado como chave única.
  // O link deve usar o ID do produto real, mas como não temos o product_id no CartItem mapeado,
  // vamos usar o ID do item como fallback para o link, assumindo que ele é o ID do produto.
  const productId = item.id; 

  return (
    <div className="flex items-center space-x-4 p-3 border-b last:border-b-0 dark:border-gray-700">
      <Link to={`/sales/${productId}`} className="flex-shrink-0">
        <img 
          src={item.images[0]} 
          alt={item.title} 
          className="w-16 h-16 rounded-lg object-cover hover:opacity-80 transition-opacity" 
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/sales/${productId}`}>
          <p className="font-medium dark:text-white line-clamp-1 hover:text-blue-500">{item.title}</p>
        </Link>
        <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
        <p className="text-xs text-gray-500">Vendido por: {item.shop.name}</p>
      </div>
      <div className="text-right flex flex-col items-end">
        <p className="font-semibold dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
        {orderStatus === 'delivered' && (
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 mt-1 text-xs text-blue-600 dark:text-blue-400"
            onClick={() => console.log('Review button clicked')}
          >
            <Star className="h-3 w-3 mr-1" />
            Avaliar
          </Button>
        )}
      </div>
    </div>
  );
}