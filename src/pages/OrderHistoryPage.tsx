"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, ArrowLeft, Star, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import OrderItemCard from "@/components/OrderItemCard"; // Novo componente

const statusMap: Record<OrderStatus, { text: string; icon: React.ElementType; color: string }> = {
  pending: { text: "Pendente", icon: Package, color: "bg-yellow-100 text-yellow-800" },
  confirmed: { text: "Confirmado", icon: ShoppingBag, color: "bg-blue-100 text-blue-800" },
  shipped: { text: "Enviado", icon: Truck, color: "bg-purple-100 text-purple-800" },
  delivered: { text: "Entregue", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  cancelled: { text: "Cancelado", icon: XCircle, color: "bg-red-100 text-red-800" },
};

export default function OrderHistoryPage() {
  const { orders, loading, error, fetchOrders } = useOrders();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Chama a busca de pedidos quando o usuário autentica
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  if (authLoading || loading) {
    return <Loading />;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Você precisa estar logado para ver seus pedidos.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 dark:bg-gray-900 dark:border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link to="/account">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Meus Pedidos</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error ? (
          <div className="text-center py-12 p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-3" />
            <h2 className="font-semibold text-lg">Erro ao carregar pedidos</h2>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-2">Verifique o console para detalhes do erro de API/Mapeamento.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold dark:text-white">Nenhum pedido encontrado</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Seus pedidos aparecerão aqui assim que você fizer uma compra.</p>
            <Button asChild>
              <Link to="/">Começar a Comprar</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusMap[order.status].icon;
              return (
                <Card key={order.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between border-b dark:border-gray-700 p-4">
                    <div>
                      <CardTitle className="text-lg dark:text-white">Pedido #{order.orderNumber}</CardTitle>
                      <p className="text-xs text-gray-500">
                        Feito em {new Date(order.orderDate).toLocaleDateString('pt-MZ')}
                      </p>
                    </div>
                    <Badge className={statusMap[order.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusMap[order.status].text}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <OrderItemCard 
                          key={item.id} 
                          item={item} 
                          orderStatus={order.status} 
                        />
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex items-center justify-between dark:border-gray-700">
                      <p className="text-lg font-bold dark:text-white">Total: {formatCurrency(order.total)}</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/order-confirmation/${order.id}`}>Ver Detalhes</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}