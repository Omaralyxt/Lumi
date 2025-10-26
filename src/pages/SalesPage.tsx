"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getSimilarProducts } from "@/api/products";
import { Product, ProductVariant } from "@/types/product";
import { 
  Star, 
  Heart, 
  Truck, 
  CheckCircle, 
  ShoppingCart, 
  Plus, 
  Minus, 
  ArrowLeft,
  Store as StoreIcon,
  Share2 
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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
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
        
        // Selecionar a primeira variante por padrão
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        } else {
          setSelectedVariant(null);
        }
        
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

  // Determinar o preço e estoque exibidos
  const currentPrice = selectedVariant?.price ?? product?.price ?? 0;
  const currentStock = selectedVariant?.stock ?? product?.stock ?? 0;
  
  // Determinar as imagens a serem exibidas
  const variantImage = selectedVariant?.image_url;
  const allImages = useMemo(() => {
    const baseImages = product?.images || [];
    if (variantImage && !baseImages.includes(variantImage)) {
      // Se a variante tem uma imagem única, colocamos ela em primeiro
      return [variantImage, ...baseImages.filter(img => img !== variantImage)];
    }
    return baseImages;
  }, [product?.images, variantImage]);

  const handleAddToCart = () => {
    if (product) {
      const itemToAdd = {
        ...product,
        // Se houver variante selecionada, ajustamos o título e o preço/estoque
        title: selectedVariant ? `${product.title} (${selectedVariant.name})` : product.title,
        price: currentPrice,
        stock: currentStock,
        id: selectedVariant?.id || product.id, // Usar ID da variante para o carrinho
        images: allImages,
        // Nota: O CartContext precisa ser atualizado para lidar com IDs de variante
      };
      
      addProductToCart(itemToAdd as Product, quantity);
      toast.success(`${itemToAdd.title} adicionado ao carrinho!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Adicionar ao carrinho primeiro
      handleAddToCart();
      // Redirecionar para o checkout
      navigate("/checkout");
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0); // Resetar a imagem principal para a imagem da variante
    setQuantity(1); // Resetar quantidade
  };
  
  const handleShare = useCallback(async () => {
    if (!product) return;

    const shareData = {
      title: product.title,
      text: `Confira este produto incrível na Lumi: ${product.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link do produto copiado para a área de transferência!");
      }
    } catch (err) {
      console.error('Erro ao partilhar:', err);
      toast.error("Não foi possível partilhar o link.");
    }
  }, [product]);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900 truncate">{product.title}</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
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
                src={allImages[selectedImageIndex]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {allImages.map((image, index) => (
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

          {/* Product Info & Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="font-title text-3xl text-gray-900 mb-2">
                    {product.title}
                    {selectedVariant && <span className="text-xl font-body text-gray-600 ml-2">({selectedVariant.name})</span>}
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
                <div className="flex items-baseline space-x-2">
                  <span className="font-title text-3xl font-bold text-blue-600">
                    MT {currentPrice.toLocaleString('pt-MZ')}
                  </span>
                  {product.originalPrice && (
                    <span className="font-body text-lg text-gray-500 line-through">
                      MT {product.originalPrice.toLocaleString('pt-MZ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-body-semibold">{product.rating.toFixed(1)}</span>
                  <span className="font-body text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <span className="font-body text-gray-500">•</span>
                <span className={`font-body-semibold ${currentStock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                  {currentStock > 0 ? `${currentStock} disponíveis` : 'Esgotado'}
                </span>
              </div>
            </div>

            {/* Product Variants Selection */}
            {product.variants.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-title text-lg font-semibold mb-3">Selecione a Variante:</h3>
                  <div className="space-y-4">
                    {/* Assumindo que todas as variantes são do mesmo tipo (ex: Cor/Modelo) */}
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(variant)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            selectedVariant?.id === variant.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {variant.name} (MT {variant.price.toLocaleString('pt-MZ')})
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery and Seller Info (Minimal) */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-body-semibold">Entrega Rápida</h3>
                    <p className="text-sm text-gray-600">
                      Prazo: {product.deliveryInfo.eta} | Custo: MT {product.deliveryInfo.fee.toLocaleString('pt-MZ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 border-t pt-3">
                  <StoreIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-body-semibold">Vendido por</h3>
                    <p className="text-sm text-gray-600">
                      {product.shop.name} {product.shop.isVerified && <CheckCircle className="h-4 w-4 inline text-green-500 ml-1" />}
                    </p>
                  </div>
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
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock || currentStock === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 font-body-semibold"
              >
                {currentStock === 0 ? 'Esgotado' : 'Comprar Agora'}
              </Button>
              <Button 
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                variant="outline"
                className="w-full text-lg py-6 font-body-semibold"
              >
                {currentStock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
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

        {/* Similar Products (Placeholder) */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-title text-2xl font-bold mb-6">Produtos Similares</h2>
            {/* Usar ProductGrid, mas sem mostrar info da loja */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map(p => (
                <Link key={p.id} to={`/sales/${p.id}`} className="block">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover" />
                    <CardContent className="p-3">
                      <p className="text-sm font-semibold line-clamp-2">{p.title}</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">MT {p.price.toLocaleString('pt-MZ')}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}