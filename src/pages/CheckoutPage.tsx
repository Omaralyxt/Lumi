"use client";

import { useState, useEffect, useCallback } from "react";
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
import { MapPin, CreditCard, Truck, Lock, Clock, AlertCircle, CheckCircle, Phone, Edit } from "lucide-react";
import { toast } from "sonner";
import { initiateMpesaPayment } from "@/utils/mpesa";
import MpesaStatusModal from "@/components/MpesaStatusModal";
import { getCustomerAddresses, setActiveAddress, CustomerAddress } from "@/api/addresses"; // Importar API de Endereços

interface CheckoutErrors {
  address?: string;
  payment?: string;
  mpesaPhone?: string;
}

const paymentMethods = [
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: "💳",
    description: "Pagamento via telemóvel",
    instructions: "Será enviado um USSD Push para o seu número M-Pesa.",
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
  const { createOrder, loading: orderLoading } = useOrders();
  const navigate = useNavigate();
  
  // Novo estado para endereços reais
  const [availableAddresses, setAvailableAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  
  const [selectedPayment, setSelectedPayment] = useState("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStep, setOrderStep] = useState<"address" | "payment" | "confirm">("address");

  // Mpesa Modal State
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [currentOrderNumber, setCurrentOrderNumber] = useState<string | null>(null);

  // 1. Fetch Addresses
  const fetchAddresses = useCallback(async () => {
    setAddressLoading(true);
    try {
      const addresses = await getCustomerAddresses();
      setAvailableAddresses(addresses);
      
      const activeAddress = addresses.find(a => a.is_active) || addresses[0];
      setSelectedAddress(activeAddress || null);
      
      if (activeAddress) {
        // Tenta preencher o telefone M-Pesa com o telefone do endereço ativo (se disponível)
        // Nota: O telefone do endereço não está na tabela customer_addresses, mas vamos usar o telefone do perfil do usuário se necessário.
        // Por enquanto, vamos usar um mock de telefone se o campo estiver vazio.
        setMpesaPhone("+258 84 123 4567"); // Mocked phone
      }
      
    } catch (error) {
      toast.error("Falha ao carregar endereços de entrega.");
    } finally {
      setAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    fetchAddresses();
  }, [cartItems, navigate, fetchAddresses]);

  const subtotal = cartTotal;
  const total = subtotal + deliveryFee;

  const validateForm = () => {
    const newErrors: CheckoutErrors = {};
    
    if (orderStep === "address" && !selectedAddress) {
      newErrors.address = "Por favor, selecione um endereço de entrega";
    }
    
    if (orderStep === "payment" && !selectedPayment) {
      newErrors.payment = "Por favor, selecione um método de pagamento";
    }
    
    if (orderStep === "payment" && selectedPayment === "mpesa" && (!mpesaPhone || mpesaPhone.length < 9)) {
      newErrors.mpesaPhone = "O número M-Pesa é obrigatório e deve ser válido.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm() || !selectedAddress) {
      setOrderStep("payment"); 
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Criar o pedido no Supabase (status: pending, payment_status: awaiting_payment)
      const orderData = {
        items: cartItems,
        total,
        shippingAddress: {
          name: selectedAddress.name,
          phone: mpesaPhone, // Usando o telefone M-Pesa como telefone de contato
          address: selectedAddress.full_address,
          city: selectedAddress.city,
          district: selectedAddress.district || '',
        },
        paymentMethod: selectedPayment,
        deliveryInfo: getDeliveryInfo(selectedAddress.city),
      };
      
      const order = await createOrder(orderData);
      
      // 2. Processar Pagamento M-Pesa (se selecionado)
      if (selectedPayment === "mpesa") {
        toast.loading("Iniciando USSD Push M-Pesa...", { id: 'mpesa-init' });
        
        const mpesaResult = await initiateMpesaPayment({
          msisdn: mpesaPhone,
          amount: total,
          orderNumber: order.orderNumber,
        });
        
        toast.dismiss('mpesa-init');

        if (mpesaResult.success) {
          setCurrentOrderId(order.id);
          setCurrentOrderNumber(order.orderNumber);
          setIsMpesaModalOpen(true);
          
          setIsSubmitting(false);
          return; 
        } else {
          toast.error(mpesaResult.error || "Falha ao iniciar transação M-Pesa.");
          setIsSubmitting(false);
          return; 
        }
      }
      
      // 3. Se não for M-Pesa, limpar carrinho e redirecionar imediatamente
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Falha crítica ao finalizar pedido.");
    } finally {
      if (selectedPayment !== "mpesa") {
        setIsSubmitting(false);
      }
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
  
  const handleAddressSelection = async (address: CustomerAddress) => {
    setSelectedAddress(address);
    if (!address.is_active) {
      try {
        await setActiveAddress(address.id);
        fetchAddresses(); // Re-fetch para atualizar o estado de todos os endereços
      } catch (error) {
        toast.error("Falha ao definir endereço ativo.");
      }
    }
  };

  if (cartItems.length === 0 || addressLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3">Carregando checkout...</p>
      </div>
    );
  }
  
  const activeAddress = selectedAddress || availableAddresses.find(a => a.is_active);
  const deliveryEta = activeAddress ? getDeliveryInfo(activeAddress.city).eta : 'N/A';
  const deliveryFeeDisplay = deliveryFee.toLocaleString('pt-MZ');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (Mantido) */}
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

      {/* Progress Bar (Mantido) */}
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
                    (step.id === "address" && orderStep !== "payment" && orderStep !== "confirm") ||
                    (step.id === "payment" && orderStep === "confirm")
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 font-medium hidden sm:inline ${
                    orderStep === step.id || 
                    (step.id === "address" && orderStep !== "payment" && orderStep !== "confirm") ||
                    (step.id === "payment" && orderStep === "confirm")
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-4 hidden sm:block ${
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Endereço de Entrega
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => navigate('/addresses')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Gerenciar Endereços
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {errors.address && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-red-700 text-sm">{errors.address}</span>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {availableAddresses.length === 0 ? (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                        Nenhum endereço cadastrado. Por favor, adicione um em "Gerenciar Endereços".
                      </div>
                    ) : (
                      availableAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedAddress?.id === address.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleAddressSelection(address)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium">{address.name}</h3>
                                {address.is_active && (
                                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Ativo</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mt-1">
                                {address.full_address}, {address.district}, {address.city}
                              </p>
                              {address.latitude && (
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                  <LocateFixed className="h-3 w-3 mr-1" />
                                  GPS: {address.latitude.toFixed(4)}, {address.longitude?.toFixed(4)}
                                </p>
                              )}
                            </div>
                            {selectedAddress?.id === address.id && (
                              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleNextStep} disabled={!selectedAddress}>
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
                  
                  {selectedPayment === "mpesa" && (
                    <div className="space-y-2 border-t pt-4">
                      <Label htmlFor="mpesa-phone">Número M-Pesa *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="mpesa-phone"
                          type="tel"
                          placeholder="25884xxxxxxx"
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      {errors.mpesaPhone && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.mpesaPhone}
                        </p>
                      )}
                    </div>
                  )}

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
            {orderStep === "confirm" && activeAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmar Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Summary (Mantido) */}
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
                          <span>MT {deliveryFeeDisplay}</span>
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
                      <strong>Endereço:</strong> {activeAddress.full_address}, {activeAddress.district}, {activeAddress.city}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Previsão de entrega:</strong> {deliveryEta}
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
                    {selectedPayment === "mpesa" && (
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Número M-Pesa:</strong> {mpesaPhone}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setOrderStep("payment")}>
                      Voltar
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting || orderLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting || orderLoading ? (
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

          {/* Order Summary Sidebar (Mantido) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resumo Final</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Entrega em {activeAddress?.city || 'N/A'}, {activeAddress?.district || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {deliveryEta}
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
                    <span>MT {deliveryFeeDisplay}</span>
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
      
      {/* M-Pesa Status Modal */}
      {currentOrderId && currentOrderNumber && (
        <MpesaStatusModal
          isOpen={isMpesaModalOpen}
          onClose={() => {
            setIsMpesaModalOpen(false);
          }}
          orderId={currentOrderId}
          orderNumber={currentOrderNumber}
        />
      )}
    </div>
  );
}