"use client";

import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, CreditCard, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/context/OrdersContext';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';

// Componente de Item do Pedido
const OrderItemSummary = ({ item }: { item: Order['items'][0] }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-b-0">
    <div className="flex items-center space-x-4">
      <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded object-cover" />
      <div>
        <p className="font-medium text-sm line-clamp-1">{item.title}</p>
        <p className="text-xs text-gray-500">Qtd: {item.quantity} | {item.options[0]?.values[0]}</p>
      </div>
    </div>
    <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
  </div>
);

// Componente de Resumo da Loja
const StoreSummary = ({ storeId, items, order }: { storeId: string; items: Order['items']; order: Order }) => {
  const storeName = items[0].shop.name;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Assumindo que o custo de envio é o mesmo para todos os itens do mesmo pedido (simplificação)
  const deliveryFee = order.shippingCost; 
  const total = subtotal + deliveryFee;

  return (
    <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="py-3 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg text-gray-900 dark:text-white">{storeName}</span>
          </div>
          <Badge variant="secondary" className="text-xs">Vendedor</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {items.map(item => (
          <OrderItemSummary key={item.id} item={item} />
        ))}
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal dos Produtos:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Custo de Envio:</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <Separator className="my-2 dark:bg-gray-700" />
          <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white">
            <span>Total da Loja:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();

  const order = useMemo(() => {
    if (orderId) {
      return getOrderById(orderId);
    }
    return null;
  }, [orderId, getOrderById]);

  // Agrupar itens do pedido por loja (embora o mock atual só tenha um storeId por pedido)
  const groupedItems = useMemo(() => {
    if (!order) return {};
    const groups: Record<string, Order['items']> = {};
    order.items.forEach(item => {
      const storeId = item.shop.id;
      if (!groups[storeId]) {
        groups[storeId] = [];
      }
      groups[storeId].push(item);
    });
    return groups;
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
        <Card className="p-8 text-center dark:bg-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Carregando Confirmação...</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Confirmação Header */}
        <Card className="text-center mb-8 p-6 dark:bg-green-900/20 dark:border-green-700 border-green-300 bg-green-50">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">Pedido Finalizado com Sucesso!</h1>
          <p className="text-gray-700 dark:text-gray-300">Obrigado pela sua compra. Seu pedido foi processado e está aguardando pagamento.</p>
          <p className="text-lg font-semibold mt-4 text-gray-900 dark:text-white">Nº do Pedido: {order.orderNumber}</p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal: Detalhes do Pedido */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Resumo do Pagamento */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-xl dark:text-white">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Detalhes do Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Método:</span>
                  <span className="font-medium dark:text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                    {order.paymentStatus === 'paid' ? 'Pago' : 'Aguardando Pagamento'}
                  </Badge>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total Pago:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Endereço de Entrega */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-xl dark:text-white">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold">{order.buyerName}</p>
                <p>{order.buyerAddress}, {order.buyerCity}</p>
                <p>Telefone: {order.buyerPhone}</p>
              </CardContent>
            </Card>

            {/* Itens do Pedido por Loja */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-xl dark:text-white">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Itens e Envio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(groupedItems).map(storeId => (
                  <StoreSummary 
                    key={storeId} 
                    storeId={storeId} 
                    items={groupedItems[storeId]} 
                    order={order}
                  />
                ))}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Entrega estimada: {order.estimatedDelivery}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral: Ações */}
          <div>
            <Card className="sticky top-24 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Próximos Passos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/orders')}
                >
                  Ver Meus Pedidos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full dark:border-gray-700 dark:hover:bg-gray-700"
                  onClick={() => navigate('/')}
                >
                  Continuar Comprando
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}