"use client";

import { useState } from "react";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Package, 
  Settings,
  Bell,
  Shield,
  Edit,
  Save,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const user = {
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

const addresses = [
  {
    id: 1,
    name: "Casa",
    phone: "+258 82 123 4567",
    address: "Av. Kenneth Kaunda, 123",
    city: "Maputo",
    district: "KaMubukwana",
    isDefault: true,
  },
  {
    id: 2,
    name: "Trabalho",
    phone: "+258 82 987 6543",
    address: "Rua dos Heróis de Mueda, 456",
    city: "Maputo",
    district: "Malhangalene",
    isDefault: false,
  },
];

const paymentMethods = [
  {
    id: 1,
    type: "mpesa",
    last4: "XXXX1234",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "bank",
    bank: "Banco de Moçambique",
    account: "1234567890",
    isDefault: false,
  },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.location.city,
    district: user.location.district,
    address: user.location.address,
  });

  const handleSave = () => {
    console.log("Saving profile:", editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.location.city,
      district: user.location.district,
      address: user.location.address,
    });
    setIsEditing(false);
  };

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
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
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
                <Badge variant="secondary">{user.role === "buyer" ? "Comprador" : "Vendedor"}</Badge>
                <span className="text-sm text-gray-500">Membro desde {user.joinedAt}</span>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Pessoal</TabsTrigger>
            <TabsTrigger value="addresses">Endereços</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded">{user.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    {isEditing ? (
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded">{user.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Cadastro</Label>
                    <p className="p-2 bg-gray-50 rounded">{user.joinedAt}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Localização</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Cidade"
                        value={editData.city}
                        onChange={(e) => setEditData({...editData, city: e.target.value})}
                      />
                      <Input
                        placeholder="Distrito"
                        value={editData.district}
                        onChange={(e) => setEditData({...editData, district: e.target.value})}
                      />
                      <Input
                        placeholder="Endereço"
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                      />
                    </div>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">
                      {user.location.address}, {user.location.district}, {user.location.city}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Endereços de Entrega</CardTitle>
                  <Button size="sm">Adicionar Endereço</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{address.name}</h3>
                            {address.isDefault && (
                              <Badge variant="secondary">Padrão</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            {address.address}, {address.district}, {address.city}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="outline" size="sm">Excluir</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Métodos de Pagamento</CardTitle>
                  <Button size="sm">Adicionar Método</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">
                              {method.type === "mpesa" ? "M-Pesa" : "Transferência Bancária"}
                            </h3>
                            {method.isDefault && (
                              <Badge variant="secondary">Padrão</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {method.type === "mpesa" 
                              ? `****${method.last4}` 
                              : `${method.bank} - ${method.account}`
                            }
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="outline" size="sm">Excluir</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
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
                      <Bell className="h-5 w-5 text-green-600" />
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}