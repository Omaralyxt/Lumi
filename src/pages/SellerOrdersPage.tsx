"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders, updateOrderStatus } from "@/api/orders";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreHorizontal, Package, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const statusMap: Record<OrderStatus, { text: string; color: string }> = {
  pending: { text: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { text: "Confirmado", color: "bg-blue-100 text-blue-800" },
  shipped: { text: "Enviado", color: "bg-purple-100 text-purple-800" },
  delivered: { text: "Entregue", color: "bg-green-100 text-green-800" },
  cancelled: { text: "Cancelado", color: "bg-red-100 text-red-800" },
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const sellerId = "seller-123"; // Simulado
        const fetchedOrders = await getSellerOrders(sellerId);
        setOrders(fetchedOrders);
      } catch (err) {
        toast.error("Não foi possível carregar os pedidos.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const originalOrders = [...orders];
    // Update UI immediately for better UX
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );

    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Pedido #${orderId} atualizado para "${statusMap[newStatus].text}".`);
    } catch (error) {
      // Revert if API call fails
      setOrders(originalOrders);
      toast.error("Falha ao atualizar o status do pedido.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/seller/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Gerenciar Pedidos</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Todos os Pedidos ({orders.length})</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Buscar por ID ou cliente..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar por Status
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando pedidos...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-semibold text-lg">Nenhum pedido recebido ainda</h3>
                <p className="text-gray-500">Novos pedidos aparecerão aqui.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-blue-600">{order.id}</TableCell>
                      <TableCell>{order.shippingAddress.name}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString('pt-MZ')}</TableCell>
                      <TableCell>
                        <Badge className={statusMap[order.status].color}>
                          {statusMap[order.status].text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        MT {order.total.toLocaleString('pt-MZ')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'confirmed')}>Marcar como Confirmado</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>Marcar como Enviado</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>Marcar como Entregue</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={() => handleStatusChange(order.id, 'cancelled')}>Cancelar Pedido</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}