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

interface Profile {
  id: string;
  full_name: string;
  store_name: string;
  phone: string;
  user_type: string;
  created_at: string;
}

export default function SellerDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("lumi_token");
    if (!token) {
      window.location.href = "/seller/login";
      return;
    }

    const storedProfile = localStorage.getItem("lumi_profile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
      setLoading(false);
    } else {
      fetch("/api/seller/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.profile) {
            setProfile(data.profile);
            localStorage.setItem("lumi_profile", JSON.stringify(data.profile));
          } else {
            setError("Sessão expirada. Por favor, faça login novamente.");
            setTimeout(() => window.location.href = "/seller/login", 2000);
          }
        })
        .catch(() => {
          setError("Erro ao carregar dados. Tente novamente.");
          setTimeout(() => window.location.href = "/seller/login", 2000);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("lumi_token");
    localStorage.removeItem("lumi_profile");
    window.location.href = "/seller/login";
  };

  const stats = {
    todaySales: 45000,
    totalSales: 234000,
    pendingOrders: 8,
    totalProducts: 45,
    rating: 4.7,
    totalReviews: 128,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.href = "/seller/login"}>
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Olá, {profile?.full_name || profile?.store_name}!
          </h1>
          <p className="text-gray-600">
            Gerencie sua loja, produtos e vendas.
          </p>
        </div>

        {/* Store Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Store className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profile?.store_name}</h2>
                <p className="text-gray-600">Membro desde {new Date(profile?.created_at || Date.now()).toLocaleDateString('pt-MZ')}</p>
                <Badge variant="secondary" className="mt-2">
                  Vendedor Verificado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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
                    <span className="text-yellow-500">★</span>
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
          <Link to="/seller/create-product">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Adicionar Produto</h3>
                <p className="text-sm text-gray-600">Crie um novo produto para sua loja</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/seller/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Meus Produtos</h3>
                <p className="text-sm text-gray-600">Gerencie seu catálogo de produtos</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/seller/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Pedidos</h3>
                <p className="text-sm text-gray-600">Acompanhe e gerencie seus pedidos</p>
              </CardContent>
            </Card>
          </Link>
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
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum pedido recente</p>
              <p className="text-sm">Seus pedidos aparecerão aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}