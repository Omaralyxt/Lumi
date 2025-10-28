"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/context/OrdersContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, MapPin, Clock, ShoppingBag } from "lucide-react";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { getOrderById, loading } = useOrders();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const orderData = getOrderById(orderId);
      if (orderData) {
        setOrder(orderData);
      } else {
        navigate("/orders");
      }
    }
  }, [orderId, getOrderById, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Pedido não encontrado</p>
      </div>
    );
  }

  const statusConfig = {
    pending: { 
      icon: Clock, 
      color: "bg-yellow-100 text-yellow-800", 
      label: "Pendente" 
    },
    confirmed: { 
      icon: Package, 
      color: "bg-blue-100 text-blue-800", 
      label: "Confirmado" 
    },
    shipped: { 
      icon: Truck, 
      color: "bg-purple-100 text-purple-800", 
      label: "Enviado" 
    },
    delivered: { 
      icon: CheckCircle, 
      color: "bg-green-100 text-green-800", 
      label: "Entregue" 
    },
    cancelled: { 
      icon: Package, 
      color: "bg-red-100 text-red-800", 
      label: "Cancelado" 
    },
  };

  const StatusIcon = statusConfig[order.status].icon;
  const statusColor = statusConfig[order.status].color;
  const statusLabel = statusConfig[order.status].label;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Lumi</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600">
            Obrigado por sua compra. Seu pedido foi recebido e está sendo processado.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Número do pedido: <span className="font-semibold">{order.id}</span>
          </p>
        </div>

        {/* Order Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Status do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusColor}`}>
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{statusLabel}</h3>
                  <p className="text-sm text-gray-600">
                    {order.status === 'pending' && 'Aguardando confirmação do vendedor'}
                    {order.status === 'confirmed' && 'Pedido confirmado e sendo preparado'}
                    {order.status === 'shipped' && 'Seu pedido foi enviado'}
                    {order.status === 'delivered' && 'Pedido entregue com sucesso'}
                    {order.status === 'cancelled' && 'Pedido cancelado'}
                  </p>
                </div>
              </div>
              <Badge className={statusColor}>
                {statusLabel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Informações de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Destinatário</p>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{order.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium">
                    {order.shippingAddress.address}, {order.shippingAddress.district}
                  </p>
                  <p className="font-medium">{order.shippingAddress.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Previsão de entrega</p>
                  <p className="font-medium">{order.estimatedDelivery}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Método</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">Pago</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-xl text-blue-600">
                    MT {order.total.toLocaleString('pt-MZ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      MT {(item.price * item.quantity).toLocaleString('pt-MZ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="flex-1">
            <a href={`/order-invoice/${order.id}`} download>
              Baixar Comprovativo
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href={`/track-order/${order.id}`}>
              Rastrear Pedido
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href="/">
              Continuar Comprando
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}