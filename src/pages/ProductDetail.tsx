"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, Truck, Clock, Zap, Package, Eye, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockProduct = {
  id: 1,
  title: "Smartphone Samsung Galaxy A54 5G",
  description: "Smartphone com tela AMOLED de 6.4 polegadas, processador octa-core, 128GB de armazenamento, 6GB RAM, câmera tripla de 50MP, bateria de 5000mAh.",
  price: 12500,
  originalPrice: 15000,
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
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  options: [
    {
      name: "Cor",
      values: ["Preto", "Branco", "Azul"]
    },
    {
      name: "Armazenamento",
      values: ["128GB", "256GB"]
    }
  ],
  timeDelivery: "2-5 dias úteis",
};

const mockSimilarProducts = [
  {
    id: 2,
    title: "Tênis Esportivo Nike Air Max",
    price: 2500,
    image: "/placeholder.svg",
    shop: "ModaExpress",
    rating: 4.2,
  },
  {
    id: 3,
    title: "Panela de Pressão Inox",
    price: 1800,
    image: "/placeholder.svg",
    shop: "CozinhaFeliz",
    rating: 4.8,
  },
  {
    id: 4,
    title: "Fone de Ouvido Bluetooth",
    price: 1999,
    image: "/placeholder.svg",
    shop: "TechStore MZ",
    rating: 4.3,
  },
  {
    id: 5,
    title: "Smartwatch Xiaomi Mi Band",
    price: 1299,
    image: "/placeholder.svg",
    shop: "TechStore MZ",
    rating: 4.6,
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(mockProduct);
  const [similarProducts] = useState(mockSimilarProducts);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Em um app real, buscaria o produto pelo ID
    // getProductById(id).then(setProduct);
    calculateDelivery(product);
    setLoading(false);
  }, [id, product]);

  const calculateDelivery = (p) => {
    const custo = p.price > 5000 ? 0 : 250; // Frete grátis acima de 5000 MZN
    setDeliveryCost(custo);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Em um app real, salvaria no backend
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produto adicionado ao carrinho 🛒");
  };

  const handleOptionSelect = (optionName, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [optionName]: value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
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
            
            {/* Thumbnail Images */}
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <Badge variant="secondary">{product.category}</Badge>
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
              
              {/* Price */}
              <div className="mt-4">
                {product.originalPrice && (
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
                )}
                {!product.originalPrice && (
                  <span className="text-3xl font-bold text-blue-600">
                    MT {product.price.toLocaleString('pt-MZ')}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                  <span className="text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className={`font-medium ${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
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
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
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

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={addToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
              <Button 
                variant="outline"
                disabled={product.stock === 0}
                className="w-full"
              >
                Comprar Agora
              </Button>
            </div>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Entrega em {product.deliveryInfo.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {product.timeDelivery} • MT {deliveryCost.toLocaleString('pt-MZ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-600" />
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

        {/* Similar Products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarProducts.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="relative mb-3">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Badge className="absolute top-1 left-1 bg-blue-500 text-white text-xs">
                      <Eye className="h-2 w-2 mr-1" />
                      Ver
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.shop}</p>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs">{item.rating}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-600">
                        MT {item.price.toLocaleString('pt-MZ')}
                      </span>
                      <Button size="sm" className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}