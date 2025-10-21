"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getSimilarProducts } from "../api/products";
import { Product } from "../types/product";
import { Star, Heart, Truck, Clock, Zap, Package, Eye, ShoppingCart, Plus, Minus, HelpCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await getProductById(id || "");
        setProduct(productData);
        
        calculateDelivery(productData);
        
        const similarData = await getSimilarProducts(productData.category, productData.id);
        setSimilarProducts(similarData);
        
      } catch (err) {
        setError("Erro ao carregar dados do produto. Tente novamente.");
        console.error("Erro ao buscar produto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const calculateDelivery = (p: Product) => {
    const custo = p.price > 5000 ? 0 : 250;
    setDeliveryCost(custo);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === product.id);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produto adicionado ao carrinho 🛒");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.href = "/"}>
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 mb-4">Produto não encontrado</p>
          <Button onClick={() => window.location.href = "/"}>
            Voltar para Home
          </Button>
        </div>
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
              <h1 className="text-xl font-bold text-gray-900 font-body">Lumi</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </div>
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
                  <span className="ml-1 font-body-semibold">{product.rating}</span>
                  <span className="font-body text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <span className="font-body text-gray-500">•</span>
                <span className={`font-body-semibold ${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                  {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
                </span>
              </div>
            </div>

            {/* Shop Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm font-body">{product.shop.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-body-semibold">{product.shop.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Membro desde {product.shop.memberSince}</span>
                        <span>•</span>
                        <span>{product.shop.productCount} produtos</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="font-body">Ver Perfil</Button>
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
                onClick={addToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 font-body-semibold"
              >
                {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description" className="font-body-semibold">Descrição</TabsTrigger>
              <TabsTrigger value="specifications" className="font-body-semibold">Especificações</TabsTrigger>
              <TabsTrigger value="reviews" className="font-body-semibold">Avaliações ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="qa" className="font-body-semibold">Q&A ({product.qa?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-title text-xl font-body-semibold mb-4">Descrição do Produto</h3>
                  <p className="font-body text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
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
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-title text-xl font-body-semibold">Avaliações dos Clientes</h3>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qa" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-title text-xl font-body-semibold mb-6">Perguntas e Respostas</h3>
                  <div className="space-y-6 mb-8">
                    {product.qa?.map((item) => (
                      <div key={item.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <HelpCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-body-semibold">{item.question}</p>
                            <p className="text-sm text-gray-500">por {item.author} • {item.date}</p>
                          </div>
                        </div>
                        {item.answer && (
                          <div className="flex items-start space-x-3 mt-4 pl-8">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-600 font-bold text-sm">{item.author.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-body text-gray-800">{item.answer}</p>
                              <p className="text-sm text-gray-500">respondido por {item.author} • {item.date}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <Label htmlFor="question" className="font-body-semibold">Faça uma pergunta</Label>
                    <div className="relative mt-2">
                      <Textarea id="question" placeholder="Escreva sua pergunta aqui..." className="pr-12" />
                      <Button size="sm" className="absolute right-2 top-2">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}