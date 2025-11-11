"use client";

import React, { useEffect } from 'react';
import { useOrders } from '@/context/OrdersContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Loader2, Package, ShoppingBag } from 'lucide-react';
import { Order } from '@/types/order';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Componente auxiliar para exibir um único pedido
const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'shipped':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <ShoppingBag className="w-4 h-4 mr-2 text-primary" />
          Pedido #{order.orderNumber}
        </CardTitle>
        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-2">MZN {order.total.toFixed(2)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Data: {format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm')}
        </p>
        
        <Separator className="my-3" />

        <div className="space-y-2">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{item.title} ({item.quantity}x)</span>
              <span>MZN {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
              + {order.items.length - 2} item(s) a mais
            </p>
          )}
        </div>
        
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link to={`/orders/${order.id}`}>Ver Detalhes</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderHistoryPage: React.FC = () => {
  const { orders, loading, error, fetchOrders } = useOrders();

  useEffect(() => {
    // Chama a função de busca de pedidos ao montar o componente
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg text-gray-600 dark:text-gray-300">Carregando seus pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p className="text-xl font-semibold">Erro ao carregar pedidos</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Histórico de Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium dark:text-gray-300">Você ainda não fez nenhum pedido.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Comece a explorar nossos produtos e faça sua primeira compra!
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Ir para a página inicial</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;