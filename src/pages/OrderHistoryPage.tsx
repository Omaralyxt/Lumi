"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBuyerOrders } from "@/api/orders";
import { submitReview } from "@/api/products";
import { Order, OrderStatus } from "@/types/order";
import { Product, Review } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, ArrowLeft, Star } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";

const statusMap: Record<OrderStatus, { text: string; icon: React.ElementType; color: string }> = {
  pending: { text: "Pendente", icon: Package, color: "bg-yellow-100 text-yellow-800" },
  confirmed: { text: "Confirmado", icon: ShoppingBag, color: "bg-blue-100 text-blue-800" },
  shipped: { text: "Enviado", icon: Truck, color: "bg-purple-100 text-purple-800" },
  delivered: { text: "Entregue", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  cancelled: { text: "Cancelado", icon: XCircle, color: "bg-red-100 text-red-800" },
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userId = "user-123"; // Simulado
        const fetchedOrders = await getBuyerOrders(userId);
        setOrders(fetchedOrders);
      } catch (err) {
        setError("Não foi possível carregar seus pedidos.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOpenReviewModal = (product: Product) => {
    setReviewingProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewingProduct(null);
    setIsReviewModalOpen(false);
  };

  const handleReviewSubmit = async (reviewData: Omit<Review, 'id' | 'author' | 'date'>) => {
    if (!reviewingProduct) return;
    await submitReview(reviewingProduct.id, reviewData);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-4">
              <Link to="/account">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Meus Pedidos</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando pedidos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-lg font-semibold">Nenhum pedido encontrado</h2>
              <p className="text-gray-600 mb-4">Seus pedidos aparecerão aqui assim que você fizer uma compra.</p>
              <Button asChild>
                <Link to="/">Começar a Comprar</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const StatusIcon = statusMap[order.status].icon;
                return (
                  <Card key={order.id}>
                    <CardHeader className="flex flex-row items-center justify-between border-b">
                      <div>
                        <CardTitle>Pedido #{order.id}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Feito em {new Date(order.orderDate).toLocaleDateString('pt-MZ')}
                        </p>
                      </div>
                      <Badge className={statusMap[order.status].color}>
                        <StatusIcon className="h-4 w-4 mr-2" />
                        {statusMap[order.status].text}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">MT {item.price.toLocaleString('pt-MZ')}</p>
                              {order.status === 'delivered' && (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="h-auto p-0 mt-1"
                                  onClick={() => handleOpenReviewModal(item)}
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Deixar Avaliação
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-4 pt-4 flex items-center justify-between">
                        <p className="text-lg font-bold">Total: MT {order.total.toLocaleString('pt-MZ')}</p>
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {reviewingProduct && (
        <ReviewForm
          product={reviewingProduct}
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
}