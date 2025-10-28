"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Edit, MapPin, Phone, Mail, Shield, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ThemeToggle";

const user = {
  id: "user-12345",
  name: "João Silva",
  email: "joao.silva@email.com",
  phone: "+258 82 123 4567",
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

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.location.address,
    city: user.location.city,
    district: user.location.district,
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary">Membro desde {user.joinedAt}</Badge>
                <span className="text-sm text-gray-500">{user.orders} pedidos</span>
              </div>
            </div>
            <Button onClick={handleEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-900">{user.name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-900">{user.phone}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="city">Cidade</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-900">{user.location.city}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="district">Bairro</Label>
              {isEditing ? (
                <Input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-gray-900">{user.location.district}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="address">Endereço</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                />
              ) : (
                <p className="text-gray-900">{user.location.address}</p>
              )}
            </div>
            
            {isEditing && (
              <div className="flex space-x-3">
                <Button onClick={handleSave}>Salvar Alterações</Button>
                <Button variant="outline" onClick={handleEdit}>Cancelar</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Segurança da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Senha</h3>
                  <p className="text-sm text-gray-600">Última alteração: 3 meses atrás</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Alterar Senha</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Notificações</h3>
                  <p className="text-sm text-gray-600">Gerenciar preferências de notificação</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium">Excluir Conta</h3>
                  <p className="text-sm text-gray-600">Remover permanentemente sua conta</p>
                </div>
              </div>
              <Button variant="destructive" size="sm">Excluir Conta</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}