"use client";

import { useCart, CartItem } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils"; // Importação adicionada

const CartItemRow = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <img src={item.images[0]} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />
      <div className="flex-1">
        <Link to={`/product/${item.id}`} className="font-semibold hover:text-blue-600">{item.title}</Link>
        <Link to={`/store/${item.shop.id}`} className="text-sm text-gray-500 hover:underline hover:text-blue-600">
          {item.shop.name}
        </Link>
        <p className="text-sm font-bold text-blue-600">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center border rounded-lg">
        <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="px-3 text-center">{item.quantity}</span>
        <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="font-semibold w-24 text-right">{formatCurrency(item.price * item.quantity)}</p>
      <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function CartPage() {
  const { cartItems, cartSubtotal, deliveryFee, cartTotal, clearCart } = useCart();
  const total = cartTotal; // cartTotal já inclui o deliveryFee

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
        <p className="text-gray-600 mb-6">Parece que você ainda não adicionou nada ao seu carrinho.</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-title mb-8">Seu Carrinho</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no carrinho</CardTitle>
                <Button variant="outline" onClick={clearCart}>Esvaziar Carrinho</Button>
              </CardHeader>
              <CardContent>
                {cartItems.map(item => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega</span>
                  <span>{deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <Button asChild className="w-full text-lg py-6">
                  <Link to="/checkout">Ir para o Checkout</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}