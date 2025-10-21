"use client";

import { Link } from "react-router-dom";
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
  id: "user-12345",
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

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Minha Conta</h1>
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

        {/* Menu Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Meus Pedidos</h3>
                  <p className="text-sm text-gray-600">Acompanhe seus pedidos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/favorites">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Favoritos</h3>
                  <p className="text-sm text-gray-600">Veja seus produtos salvos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Perfil</h3>
                  <p className="text-sm text-gray-600">Edite suas informações</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">Configurações</h3>
                <p className="text-sm text-gray-600">Ajustes de conta</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
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
        </div>

        <div className="mt-8">
          <Button variant="destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}