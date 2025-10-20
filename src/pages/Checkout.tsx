"use client";

import { useState } from "react";
import { MapPin, CreditCard, Wallet, Truck, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const orderItems = [
  {
    id: 1,
    title: "Smartphone Samsung Galaxy A54 5G",
    price: 12500,
    quantity: 1,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Capa de Silicone",
    price: 350,
    quantity: 2,
    image: "/placeholder.svg",
  },
];

const deliveryAddresses = [
  {
    id: 1,
    name: "João Silva",
    phone: "+258 82 123 4567",
    address: "Av. Kenneth Kaunda, 123",
    city: "Maputo",
    district: "KaMubukwana",
    isDefault: true,
  },
  {
    id: 2,
    name: "João Silva",
    phone: "+258 82 123 4567",
    address: "Rua dos Heróis de Mueda, 456",
    city: "Maputo",
    district: "Malhangalene",
    isDefault: false,
  },
];

const paymentMethods = [
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: "💳",
    description: "Pagamento via telemóvel",
  },
  {
    id: "emola",
    name: "eMola",
    icon: "📱",
    description: "Pagamento via Movitel",
  },
  {
    id: "card",
    name: "Cartão de Crédito",
    icon: "💳",
    description: "Visa, Mastercard, etc.",
  },
  {
    id: "bank",
    name: "Transferência Bancária",
    icon: "🏦",
    description: "Banco de Moçambique, BCM",
  },
];

export default function Checkout() {
  const [selectedAddress, setSelectedAddress] = useState(deliveryAddresses[0]);
  const [selectedPayment, setSelectedPayment] = useState("mpesa");
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Maputo",
    district: "KaMubukwana",
  });

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    // Implementar lógica de criação do pedido
    console.log("Criar pedido com:", { selectedAddress, selectedPayment, total });
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
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Endereço de Entrega
                  </h2>
                  <Button variant="outline" size="sm">Adicionar Novo</Button>
                </div>
                
                <div className="space-y-3">
                  {deliveryAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddress.id === address.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{address.name}</h3>
                            {address.isDefault && (
                              <Badge variant="secondary" className="text-xs">Padrão</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            {address.address}, {address.district}, {address.city}
                          </p>
                        </div>
                        {selectedAddress.id === address.id && (
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Método de Pagamento
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{method.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {selectedPayment === method.id && (
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          MT {(item.price * item.quantity).toLocaleString('pt-MZ')}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>MT {subtotal.toLocaleString('pt-MZ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete</span>
                      <span>MT {deliveryFee.toLocaleString('pt-MZ')}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-blue-600">MT {total.toLocaleString('pt-MZ')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resumo Final</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Entrega em {selectedAddress.city}, {selectedAddress.district}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      1-2 dias úteis
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Pagamento seguro com proteção do comprador
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>MT {subtotal.toLocaleString('pt-MZ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span>MT {deliveryFee.toLocaleString('pt-MZ')}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">MT {total.toLocaleString('pt-MZ')}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                >
                  Confirmar Pedido
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Ao confirmar, você concorda com nossos Termos e Condições
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}