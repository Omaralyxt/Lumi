"use client";

import { useState } from "react";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Star, 
  Truck,
  Settings,
  Edit,
  LogOut,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BiometricRegistration from "@/components/BiometricRegistration";

const user = {
  id: "user-12345", // ID de usuário para o registro biométrico
  name: "João Silva",
  email: "joao.silva@email.com",
  phone: "+258 82 123 4567",
  role: "buyer",
  location: {
    city: "Maputo",
    district: "KaMubukwana",
    address: "Av. Kenneth Kaunda, 123"
  },
  joinedAt: "Janeiro 2024",
  orders: 23,
  totalSpent: 125000,
  reviews: 5,
};

const stats = [
  { icon: ShoppingBag, label: "Pedidos", value: user.orders, color: "blue" },
  { icon: Heart, label: "Favoritos", value: 12, color: "red" },
  { icon: Star, label: "Avaliações", value: user.reviews, color: "yellow" },
  { icon: Truck, label: "Entregas", value: 20, color: "green" },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Minha Conta</h1>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary">{user.role === "buyer" ? "Comprador" : "Vendedor"}</Badge>
                <span className="text-sm text-gray-500">Membro desde {user.joinedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              red: "bg-red-100 text-red-600",
              yellow: "bg-yellow-100 text-yellow-600",
              green: "bg-green-100 text-green-600",
            };
            
            return (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <p className="p-2 bg-gray-50 rounded">{user.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="p-2 bg-gray-50 rounded">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <p className="p-2 bg-gray-50 rounded">{user.phone}</p>
                  </div>
                </div>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            {/* Conteúdo dos Pedidos */}
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BiometricRegistration userId={user.id} email={user.email} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}