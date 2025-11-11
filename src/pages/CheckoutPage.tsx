"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Truck, MapPin, CreditCard, Loader2, ShoppingCart, Plus, LocateFixed } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { CartItem } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/context/OrdersContext';
import { Badge } from '@/components/ui/badge';
import { getCustomerAddresses, CustomerAddress } from '@/api/addresses'; // Importando API de endereços

// Componente de Item do Pedido
const OrderItemSummary = ({ item }: { item: CartItem }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-b-0">
    <div className="flex items-center space-x-4">
      <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded object-cover" />
      <div>
        <p className="font-medium text-sm line-clamp-1">{item.title}</p>
        <p className="text-xs text-gray-500">Qtd: {item.quantity} | {item.options[0]?.values[0]}</p>
      </div>
    </div>
    <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
  </div>
);

// Componente de Resumo da Loja
const StoreSummary = ({ storeId, items, deliveryFee }: { storeId: string; items: CartItem[]; deliveryFee: number }) => {
  const storeName = items[0].shop.name;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  return (
    <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="py-3 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg text-gray-900 dark:text-white">{storeName}</span>
          </div>
          <Badge variant="secondary" className="text-xs">Vendedor</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {items.map(item => (
          <OrderItemSummary key={item.id} item={item} />
        ))}
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal dos Produtos:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Custo de Envio:</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <Separator className="my-2 dark:bg-gray-700" />
          <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white">
            <span>Total da Loja:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { cartItems, clearCart, getDeliveryInfo } = useCart();
  const { createOrder } = useOrders(); // Usando a função do contexto
  
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // 1. Carregar endereços do usuário
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
          const fetchedAddresses = await getCustomerAddresses();
          setAddresses(fetchedAddresses);
          
          // Selecionar o endereço ativo ou o primeiro como padrão
          const defaultAddress = fetchedAddresses.find(a => a.is_active) || fetchedAddresses[0];
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          }
        } catch (error) {
          toast.error("Falha ao carregar endereços de entrega.");
        } finally {
          setLoadingAddresses(false);
        }
      };
      fetchAddresses();
    } else {
      setLoadingAddresses(false);
    }
  }, [isAuthenticated]);

  // Agrupar itens do carrinho por loja
  const groupedItems = useMemo(() => {
    const groups: Record<string, CartItem[]> = {};
    cartItems.forEach(item => {
      if (!groups[item.shop.id]) {
        groups[item.shop.id] = [];
      }
      groups[item.shop.id].push(item);
    });
    return groups;
  }, [cartItems]);

  // Calcular o total de envio por loja
  const storeDeliveryFees = useMemo(() => {
    const fees: Record<string, number> = {};
    Object.keys(groupedItems).forEach(storeId => {
      // Usamos o deliveryInfo do primeiro item da loja para determinar a taxa de entrega
      fees[storeId] = groupedItems[storeId][0].deliveryInfo.fee;
    });
    return fees;
  }, [groupedItems]);

  const totalDeliveryFee = useMemo(() => {
    return Object.values(storeDeliveryFees).reduce((sum, fee) => sum + fee, 0);
  }, [storeDeliveryFees]);

  const totalProductsSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const finalTotal = totalProductsSubtotal + totalDeliveryFee;
  
  const selectedShippingAddress = useMemo(() => {
    return addresses.find(a => a.id === selectedAddressId);
  }, [addresses, selectedAddressId]);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar a compra.");
      navigate('/login');
      return;
    }
    if (!selectedAddressId || !selectedShippingAddress) {
      toast.error("Por favor, selecione um endereço de entrega válido.");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Por favor, selecione um método de pagamento.");
      return;
    }

    setIsProcessing(true);
    
    const orderData = {
      items: cartItems,
      total: finalTotal,
      shippingAddress: {
        name: selectedShippingAddress.name,
        phone: user.user_metadata.phone || 'N/A', // Usando telefone do Auth/Profile
        address: selectedShippingAddress.full_address,
        city: selectedShippingAddress.city,
        district: selectedShippingAddress.district,
      },
      paymentMethod: selectedPaymentMethod,
      deliveryInfo: {
        fee: totalDeliveryFee,
        eta: getDeliveryInfo(selectedShippingAddress.city).eta,
      },
    };

    try {
      const newOrder = await createOrder(orderData);
      clearCart();
      toast.success("Pedido criado com sucesso!");
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Falha ao finalizar o pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionamento se não estiver autenticado após o carregamento
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
        <Button onClick={() => navigate('/')} className="mt-4">Continuar Comprando</Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold font-title mb-8 text-gray-900 dark:text-white">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal: Endereço e Pagamento */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Endereço de Entrega */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-xl dark:text-white">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  1. Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAddresses ? (
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                    <p className="text-sm text-gray-500 mt-2">Carregando endereços...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-red-500 mb-3">Nenhum endereço cadastrado.</p>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/addresses')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Novo Endereço
                    </Button>
                  </div>
                ) : (
                  <>
                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-4">
                      {addresses.map(address => (
                        <div key={address.id} className="flex items-start space-x-3 p-3 border rounded-lg dark:border-gray-700">
                          <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
                          <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold">{address.name}</p>
                              {address.is_active && <Badge variant="secondary" className="text-xs">Padrão</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {address.full_address}, {address.district}, {address.city}
                            </p>
                            {address.latitude && address.longitude && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <LocateFixed className="h-3 w-3 mr-1" />
                                GPS: {address.latitude.toFixed(4)}, {address.longitude?.toFixed(4)}
                              </p>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button variant="outline" className="mt-4 w-full dark:border-gray-700 dark:hover:bg-gray-700" onClick={() => navigate('/addresses')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Gerenciar Endereços
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* 2. Método de Pagamento */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-xl dark:text-white">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  2. Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg dark:border-gray-700">
                    <RadioGroupItem value="mpesa" id="payment-mpesa" />
                    <Label htmlFor="payment-mpesa" className="flex-1 flex items-center justify-between cursor-pointer">
                      <span className="font-semibold">M-Pesa (Pagamento Móvel)</span>
                      <span className="text-sm text-green-600">Recomendado</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg dark:border-gray-700 opacity-50 cursor-not-allowed">
                    <RadioGroupItem value="card" id="payment-card" disabled />
                    <Label htmlFor="payment-card" className="flex-1 cursor-pointer">
                      <span className="font-semibold">Cartão de Crédito/Débito</span>
                      <span className="text-xs text-gray-500 ml-2">(Em breve)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* 3. Resumo dos Itens por Loja */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-xl dark:text-white">
                  <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                  3. Itens do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(groupedItems).map(storeId => (
                  <StoreSummary 
                    key={storeId} 
                    storeId={storeId} 
                    items={groupedItems[storeId]} 
                    deliveryFee={storeDeliveryFees[storeId]}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral: Resumo Total e Ação */}
          <div>
            <Card className="sticky top-24 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Resumo Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal dos Produtos ({cartItems.length} itens)</span>
                  <span>{formatCurrency(totalProductsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Custo Total de Envio</span>
                  <span>{formatCurrency(totalDeliveryFee)}</span>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                  <span>Total a Pagar</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
                
                <Button 
                  className="w-full text-lg py-6 mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || addresses.length === 0}
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  )}
                  {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
                </Button>
                
                <p className="text-xs text-gray-500 text-center pt-2 dark:text-gray-400">
                  Ao clicar em "Finalizar Pedido", você concorda com os Termos e Condições.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}