"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, CreditCard, Truck, Lock, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

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
    instructions: "Envie o pagamento para o número +258 82 123 4567 com a referência do pedido.",
  },
  {
    id: "emola",
    name: "eMola",
    icon: "📱",
    description: "Pagamento via Movitel",
    instructions: "Envie o pagamento para o número +258 84 987 6543 com a referência do pedido.",
  },
  {
    id: "card",
    name: "Cartão de Crédito",
    icon: "💳",
    description: "Visa, Mastercard, etc.",
    instructions: "Será redirecionado para a página segura do pagamento.",
  },
  {
    id: "bank",
    name: "Transferência Bancária",
    icon: "🏦",
    description: "Banco de Moçambique, BCM",
    instructions: "Faça a transferência para a conta BCM 123456789 com a referência do pedido.",
  },
];

const cities = [
  "Maputo",
  "Matola",
  "Beira",
  "Nampula",
  "Nacala",
  "Chimoio",
  "Quelimane",
  "Tete",
  "Inhambane",
  "Gaza",
];

export default function Checkout() {
  const { cartItems, cartTotal, deliveryFee, getDeliveryInfo, clearCart } = useCart();
  const { createOrder, loading } = useOrders();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState(deliveryAddresses[0]);
  const [selectedPayment, setSelectedPayment] = useState("mpesa");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStep, setOrderStep] = useState<"address" | "payment" | "confirm">("address");
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Maputo",
    district: "",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const subtotal = cartTotal;
  const total = subtotal + deliveryFee;

  const validateForm = () => {
    const newErrors = {};
    
    if (orderStep === "address" && !selectedAddress) {
      newErrors.address = "Por favor, selecione um endereço de entrega";
    }
    
    if (orderStep === "payment" && !selectedPayment) {
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
      const orderData = {
        items: cartItems,
        total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedPayment,
        deliveryInfo: getDeliveryInfo(selectedAddress.city),
      };
      
      const order = await createOrder(orderData);
      
      // Limpar carrinho após pedido bem-sucedido
      clearCart();
      
      // Redirecionar para página de confirmação
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setOrderStep("payment");
    }
  };

  const handleBackStep = () => {
    setOrderStep("address");
  };

  const handleAddNewAddress = () => {
    if (newAddress.name && newAddress.phone && newAddress.address && newAddress.city) {
      const newAddressObj = {
        ...newAddress,
        id: Date.now(),
        isDefault: false,
      };
      deliveryAddresses.push(newAddressObj);
      setSelectedAddress(newAddressObj);
      setNewAddress({
        name: "",
        phone: "",
        address: "",
        city: "Maputo",
        district: "",
      });
      toast.success("Novo endereço adicionado!");
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

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {[
              { id: "address", label: "Endereço", icon: MapPin },
              { id: "payment", label: "Pagamento", icon: CreditCard },
              { id: "confirm", label: "Confirmação", icon: CheckCircle },
            ].map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center ${index < 2 ? 'mr-4' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    orderStep === step.id || 
                    (step.id === "address" && orderStep !== "payment") ||
                    (step.id === "payment" && orderStep === "confirm")
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 font-medium ${
                    orderStep === step.id || 
                    (step.id === "address" && orderStep !== "payment") ||
                    (step.id === "payment" && orderStep === "confirm")
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-4 ${
                    orderStep === "payment" || orderStep === "confirm"
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Step */}
            {orderStep === "address" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Adicionar Novo Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          placeholder="João Silva"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          placeholder="+258 82 123 4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Select value={newAddress.city} onValueChange={(value) => setNewAddress({...newAddress, city: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="district">Bairro</Label>
                        <Input
                          id="district"
                          value={newAddress.district}
                          onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}
                          placeholder="KaMubukwana"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Endereço Completo</Label>
                        <Textarea
                          id="address"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          placeholder="Av. Kenneth Kaunda, 123"
                          rows={2}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddNewAddress} variant="outline" className="mt-3">
                      Adicionar Endereço
                    </Button>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleNextStep}>
                      Continuar para Pagamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {orderStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            {selectedPayment === method.id && (
                              <p className="text-xs text-blue-600 mt-2">{method.instructions}</p>
                            )}
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
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBackStep}>
                      Voltar
                    </Button>
                    <Button onClick={() => setOrderStep("confirm")}>
                      Continuar para Confirmação
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirmation Step */}
            {orderStep === "confirm" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmar Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="font-medium mb-3">Resumo do Pedido</h3>
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
                  </div>
                  
                  {/* Delivery Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Informações de Entrega
                    </h3>
                    <p className="text-sm text-gray-700">
                      <strong>Endereço:</strong> {selectedAddress.address}, {selectedAddress.district}, {selectedAddress.city}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Previsão de entrega:</strong> {getDeliveryInfo(selectedAddress.city).eta}
                    </p>
                  </div>
                  
                  {/* Payment Info */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Método de Pagamento
                    </h3>
                    <p className="text-sm text-gray-700">
                      <strong>{paymentMethods.find(m => m.id === selectedPayment)?.name}</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      {paymentMethods.find(m => m.id === selectedPayment)?.instructions}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setOrderStep("payment")}>
                      Voltar
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting || loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting || loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processando...
                        </>
                      ) : (
                        'Confirmar Pedido'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
                      {getDeliveryInfo(selectedAddress.city).eta}
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
                
                <div className="text-xs text-gray-500 text-center">
                  Ao confirmar, você concorda com nossos Termos e Condições
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}