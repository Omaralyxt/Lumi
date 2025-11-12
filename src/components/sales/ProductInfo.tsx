"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Star, Truck, ShieldCheck, CreditCard, Plus, Minus, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Product as ProductType, ProductVariant } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import FavoriteButton from "../FavoriteButton";

interface ProductInfoProps {
  product: ProductType;
  variants: ProductVariant[];
}

export function ProductInfo({ product, variants }: ProductInfoProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }, [variants]);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;
  
  // Simulação de desconto (se houver originalPrice)
  const discountPercentage = product.originalPrice && product.originalPrice > currentPrice
    ? Math.round((1 - currentPrice / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Por favor, selecione uma variante do produto.");
      return;
    }
    if (quantity <= 0 || quantity > currentStock) {
      toast.error(`Quantidade inválida. Máximo disponível: ${currentStock}`);
      return;
    }

    // Mapeamento para o CartContext (usando o ID da variante como ID do item no carrinho)
    const productForCart = {
      ...product,
      id: selectedVariant.id, 
      price: selectedVariant.price,
      stock: selectedVariant.stock,
      options: [{ name: "Variante", values: [selectedVariant.name] }],
      title: `${product.title} (${selectedVariant.name})`, // Nome do item no carrinho
    };

    addToCart(productForCart, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirecionar para o checkout (simulação)
    // Em um fluxo real, você faria um "quick checkout"
    toast.info("Redirecionando para o carrinho...");
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < currentStock) setQuantity(quantity + 1);
  };

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div>
        <Badge variant="secondary" className="text-xs font-medium dark:bg-blue-900/30 dark:text-blue-300 mb-2">
          Vendido por: {product.shop.name}
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h1>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">({product.reviewCount.toLocaleString('pt-MZ')} avaliações)</span>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={`text-xs ${isOutOfStock ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
            {isOutOfStock ? 'Esgotado' : `Em estoque (${currentStock})`}
          </Badge>
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-b py-4 dark:border-gray-700">
        {discountPercentage > 0 && product.originalPrice && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
            <Badge variant="destructive">-{discountPercentage}%</Badge>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
            {formatCurrency(currentPrice)}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {/* Simulação de desconto M-Pesa */}
          ou <span className="text-green-600 font-semibold">{formatCurrency(currentPrice * 0.95)}</span> via M-Pesa (5% de desconto)
        </p>
      </div>
      
      {/* Variants Selection */}
      {variants.length > 1 && (
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Opções:</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                className={`
                  ${selectedVariant?.id === variant.id 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-neon-blue' 
                    : 'border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                  ${variant.stock <= 0 && 'opacity-50 cursor-not-allowed line-through'}
                `}
                onClick={() => variant.stock > 0 && setSelectedVariant(variant)}
                disabled={variant.stock <= 0}
              >
                {variant.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Buy Buttons */}
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Quantidade:</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
              <button
                onClick={decrementQuantity}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus className="w-4 h-4 dark:text-white" />
              </button>
              <span className="px-6 py-2 border-x border-gray-300 dark:border-gray-700 min-w-[60px] text-center dark:text-white">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                disabled={quantity >= currentStock || isOutOfStock}
              >
                <Plus className="w-4 h-4 dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-semibold text-lg"
          onClick={handleBuyNow}
          disabled={isOutOfStock || !selectedVariant}
        >
          Comprar Agora
        </Button>
        <Button 
          variant="outline" 
          className="w-full py-6 dark:border-gray-700 dark:hover:bg-gray-700"
          onClick={handleAddToCart}
          disabled={isOutOfStock || !selectedVariant}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Adicionar ao Carrinho
        </Button>

        <div className="flex gap-2">
          <FavoriteButton product={product} className="flex-1 py-6" />
          <Button variant="outline" size="lg" className="flex-1 dark:border-gray-700 dark:hover:bg-gray-700">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3 pt-4 border-t dark:border-gray-700">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-900 dark:text-white">Entrega em {product.deliveryInfo.city}</p>
            <p className="text-gray-600 dark:text-gray-400">Custo de Envio: {formatCurrency(product.deliveryInfo.fee)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-gray-900 dark:text-white">Compra Garantida</p>
            <p className="text-gray-600 dark:text-gray-400">Receba ou seu dinheiro de volta</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-900 dark:text-white">Pagamento Seguro</p>
            <p className="text-gray-600 dark:text-gray-400">M-Pesa e cartão aceites</p>
          </div>
        </div>
      </div>
    </div>
  );
}