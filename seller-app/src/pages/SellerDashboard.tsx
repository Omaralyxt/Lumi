"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  Settings,
  LogOut,
  Plus,
  Users,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SellerLayout from "../components/SellerLayout";

const stats = {
  todaySales: 45000,
  totalSales: 234000,
  pendingOrders: 8,
  totalProducts: 45,
  rating: 4.7,
  totalReviews: 128,
};

const recentOrders = [
  {
    id: "ORD-001234",
    customer: "Ana Pereira",
    items: 3,
    total: 12500,
    status: "pending",
    date: "2 horas atrás",
  },
  {
    id: "ORD-001233",
    customer: "Carlos Mendes",
    items: 1,
    total: 8500,
    status: "confirmed",
    date: "5 horas atrás",
  },
  {
    id: "ORD-001232",
    customer: "Maria João",
    items: 2,
    total: 15600,
    status: "shipped",
    date: "1 dia atrás",
  },
];

const topProducts = [
  {
    id: 1,
    title: "Smartphone Samsung A54",
    sales: 23,
    revenue: 287500,
    stock: 12,
  },
  {
    id: 2,
    title: "Capa de Silicone",
    sales: 45,
    revenue: 15750,
    stock: 89,
  },
  {
    id: 3,
    title: "Carregador Portátil",
    sales: 18,
    revenue: 54000,
    stock: 5,
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SellerLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Olá, Bem-vindo(a) de volta!
          </h1>
          <p className="text-gray-600">
            Aqui você pode gerenciar sua loja, produtos e vendas.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    MT {stats.todaySales.toLocaleString('pt-MZ')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    MT {stats.totalSales.toLocaleString('pt-MZ')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/create-product">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Adicionar Produto</h3>
                <p className="text-sm text-gray-600">Crie um novo produto para sua loja</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Sacar Dinheiro</h3>
              <p className="text-sm text-gray-600">Retire seus lucros para sua conta</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Relatórios</h3>
              <p className="text-sm text-gray-600">Análise detalhada das suas vendas</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Pedidos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-600">{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">MT {order.total.toLocaleString('pt-MZ')}</p>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}