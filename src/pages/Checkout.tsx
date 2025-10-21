"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Truck, Lock, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

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
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(deliveryAddresses[0]);
  const [selectedPayment, setSelectedPayment] = useState("mpesa");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const subtotal = cartTotal;
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedAddress) {
      newErrors.address = "Por favor, selecione um endereço de entrega";
    }
    
    if (!selectedPayment) {
      newErrors.payment = "Por favor, selecione um método de pagamento";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      // In a real app, this would be handled by the cart context
      console.log("Pedido criado com sucesso!");
      
      // Redirect to order confirmation page
      navigate('/order-confirmation');
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Seu carrinho está vazio. Redirecionando...</p>
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
                
                {errors.address && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{errors.address}</span>
                  </div>
                )}
                
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
                
                {errors.payment && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{errors.payment}</span>
                  </div>
                )}
                
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
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        loading="lazy"
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
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
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