"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getSimilarProducts } from "@/api/products";
import { Product } from "@/types/product";
import { 
  Star, 
  Heart, 
  Truck, 
  CheckCircle, 
  Package, 
  ShoppingCart, 
  Plus, 
  Minus, 
  ArrowLeft,
  Store as StoreIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function SalesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart: addProductToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await getProductById(id || "");
        setProduct(productData);
        
        // Inicializar opções selecionadas
        const initialOptions: Record<string, string> = {};
        productData.options.forEach(option => {
          if (option.values.length > 0) {
            initialOptions[option.name] = option.values[0];
          }
        });
        setSelectedOptions(initialOptions);
        
        const similarData = await getSimilarProducts(productData.category, productData.id);
        setSimilarProducts(similarData);
        
      } catch (err) {
        setError("Erro ao carregar dados do produto. Tente novamente.");
        console.error("Erro ao buscar produto:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const handleAddToCart = () => {
    if (product) {
      addProductToCart(product, quantity);
      toast.success(`${product.title} adicionado ao carrinho!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Adicionar ao carrinho primeiro
      addProductToCart(product, quantity);
      // Redirecionar para o checkout
      navigate("/checkout");
    }
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error || "Produto não encontrado"}</p>
          <Button onClick={() => navigate("/")}>
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{product.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="font-title text-3xl text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <Badge variant="secondary" className="font-body">{product.category}</Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleFavorite}
                  className="ml-4"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </Button>
              </div>
              
              <div className="mt-4">
                {product.originalPrice && (
                  <div className="flex items-baseline space-x-2">
                    <span className="font-title text-3xl font-bold text-blue-600">
                      MT {product.price.toLocaleString('pt-MZ')}
                    </span>
                    <span className="font-body text-lg text-gray-500 line-through">
                      MT {product.originalPrice.toLocaleString('pt-MZ')}
                    </span>
                    <Badge className="bg-red-500 text-white font-body">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-body-semibold">{product.rating.toFixed(1)}</span>
                  <span className="font-body text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <span className="font-body text-gray-500">•</span>
                <span className={`font-body-semibold ${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                  {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
                </span>
              </div>
            </div>

            {/* Product Options Selection */}
            {product.options.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-title text-lg font-semibold mb-3">Selecione as opções:</h3>
                  <div className="space-y-4">
                    {product.options.map((option, index) => (
                      <div key={index}>
                        <Label className="font-body-semibold mb-2 block">{option.name}</Label>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.name, value)}
                              className={`px-4 py-2 rounded-lg border transition-colors ${
                                selectedOptions[option.name] === value
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shop Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Link to={`/store/${product.shop.id}`} className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm font-body">{product.shop.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-body-semibold group-hover:underline flex items-center">
                        <StoreIcon className="h-4 w-4 mr-1" />
                        {product.shop.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Membro desde {product.shop.memberSince}</span>
                        <span>•</span>
                        <span>{product.shop.productCount} produtos</span>
                      </div>
                    </div>
                  </Link>
                  <Button asChild variant="outline" size="sm" className="font-body">
                    <Link to={`/store/${product.shop.id}`}>Ver Perfil</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-4">
              <span className="font-body-semibold">Quantidade:</span>
              <div className="flex items-center border rounded-lg">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-12 text-center font-body">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 font-body-semibold"
              >
                {product.stock === 0 ? 'Esgotado' : 'Comprar Agora'}
              </Button>
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                variant="outline"
                className="w-full text-lg py-6 font-body-semibold"
              >
                {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-title text-xl font-body-semibold mb-4">Descrição do Produto</h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Product Specifications */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-title text-xl font-body-semibold mb-4">Especificações Técnicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-body-semibold text-gray-700">{key}:</span>
                    <span className="font-body text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Features */}
        {product.features.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-title text-xl font-body-semibold mb-4">Características</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="font-body text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delivery Info */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-title text-xl font-body-semibold mb-4">Informações de Entrega</h3>
              <div className="flex items-center space-x-4">
                <Truck className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-body-semibold">Entrega em {product.deliveryInfo.city}</p>
                  <p className="font-body text-gray-600">Taxa: MT {product.deliveryInfo.fee.toLocaleString('pt-MZ')} • Prazo: {product.deliveryInfo.eta}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}