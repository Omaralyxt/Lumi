"use client";

import { useState } from "react";
import { Star, Heart, Share2, ShoppingCart, MapPin, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const product = {
  id: 1,
  title: "Smartphone Samsung Galaxy A54 5G",
  description: "Smartphone com tela AMOLED de 6.4 polegadas, processador octa-core, 128GB de armazenamento, 6GB RAM, câmera tripla de 50MP, bateria de 5000mAh.",
  price: 12500,
  originalPrice: 15000,
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  rating: 4.5,
  reviewCount: 128,
  shop: {
    name: "TechStore MZ",
    rating: 4.7,
    reviewCount: 342,
    isVerified: true,
  },
  stock: 15,
  category: "Eletrónicos",
  features: [
    "Tela AMOLED 6.4\"",
    "Processador Octa-core",
    "128GB Armazenamento",
    "6GB RAM",
    "Câmera Tripla 50MP",
    "Bateria 5000mAh",
    "5G",
  ],
  specifications: {
    "Marca": "Samsung",
    "Modelo": "Galaxy A54 5G",
    "Cor": "Preto",
    "Armazenamento": "128GB",
    "RAM": "6GB",
    "Tela": "6.4\" AMOLED",
    "Câmera Traseira": "50MP + 12MP + 5MP",
    "Câmera Frontal": "32MP",
    "Bateria": "5000mAh",
    "Sistema Operativo": "Android 13",
  },
  deliveryInfo: {
    city: "Maputo",
    fee: 150,
    eta: "1-2 dias",
  },
  reviews: [
    {
      id: 1,
      rating: 5,
      comment: "Excelente produto, entrega rápida e em perfeito estado!",
      author: "João Silva",
      date: "2 dias atrás",
    },
    {
      id: 2,
      rating: 4,
      comment: "Bom smartphone, só a bateria poderia durar um pouco mais.",
      author: "Maria Santos",
      date: "1 semana atrás",
    },
  ],
};

export default function ProductDetail() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Implementar lógica de adicionar ao carrinho
    console.log(`Adicionar ${quantity} item(s) ao carrinho`);
  };

  const handleBuyNow = () => {
    // Implementar lógica de compra imediata
    console.log(`Comprar agora ${quantity} item(s)`);
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
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
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
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Price */}
              <div className="mt-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-blue-600">
                    MT {product.price.toLocaleString('pt-MZ')}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    MT {product.originalPrice.toLocaleString('pt-MZ')}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                  <span className="text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-green-600 font-medium">Em Stock ({product.stock} disponíveis)</span>
              </div>
            </div>

            {/* Shop Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{product.shop.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{product.shop.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-sm">{product.shop.rating}</span>
                        <span className="text-gray-500 text-sm">({product.shop.reviewCount})</span>
                        {product.shop.isVerified && (
                          <Badge variant="outline" className="text-xs">Verificado</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Ver Loja</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantidade:</span>
              <div className="flex items-center border rounded-lg">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                Comprar Agora
              </Button>
              <Button 
                onClick={handleAddToCart}
                variant="outline"
                className="w-full"
              >
                Adicionar ao Carrinho
              </Button>
            </div>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Entrega em {product.deliveryInfo.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {product.deliveryInfo.eta} • MT {product.deliveryInfo.fee}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Proteção do Comprador</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="specifications">Especificações</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações ({product.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Descrição do Produto</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <h4 className="font-medium mt-6 mb-3">Recursos Principais:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Especificações Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Avaliações dos Clientes</h3>
                    <Button variant="outline" size="sm">Escrever Avaliação</Button>
                  </div>
                  
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.author}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
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