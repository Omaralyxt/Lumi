"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getSimilarProducts } from "@/api/products";
import { Product, ProductVariant, Review } from "@/types/product";
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
  Share2,
  HelpCircle,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useReviews } from "@/context/ReviewsContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Componente auxiliar para renderizar estrelas
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))}
  </div>
);

export default function SalesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart: addProductToCart } = useCart();
  const { reviews, fetchReviews, getProductRating, submitReview } = useReviews();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  
  // Review form states (simplificado, pois o formulário completo está em ReviewForm.tsx)
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);


  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        
        const productData = await getProductById(id);
        setProduct(productData);
        
        // 1. Carregar Reviews
        await fetchReviews(id);
        
        // 2. Selecionar a primeira variante por padrão
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

    fetchProductData();
  }, [id, fetchReviews]);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  // Dados de Reviews do Contexto
  const productReviews = reviews[id || ''] || [];
  const { average: averageRating, count: reviewCount } = getProductRating(id || '');

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
        title: selectedVariant ? `${product.title} (${selectedVariant.name})` : product.title,
        price: currentPrice,
        stock: currentStock,
        id: selectedVariant?.id || product.id,
        images: allImages,
      };
      
      addProductToCart(itemToAdd as Product, quantity);
      toast.success(`${itemToAdd.title} adicionado ao carrinho!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      handleAddToCart();
      navigate("/checkout");
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
    setQuantity(1);
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
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link do produto copiado para a área de transferência!");
      }
    } catch (err) {
      console.error('Erro ao partilhar:', err);
      toast.error("Não foi possível partilhar o link.");
    }
  }, [product]);
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (newReviewRating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (newReviewComment.trim().length < 10) {
      toast.error("Seu comentário deve ter pelo menos 10 caracteres.");
      return;
    }
    
    setIsReviewSubmitting(true);
    try {
      // Nota: A lógica de upload de imagens é complexa e deve ser tratada separadamente.
      // Aqui, passamos um array vazio para simplificar.
      await submitReview(id, {
        rating: newReviewRating,
        comment: newReviewComment,
        images: [],
        verifiedPurchase: true,
      });
      setNewReviewRating(0);
      setNewReviewComment("");
    } catch (err) {
      // Erro tratado no contexto
    } finally {
      setIsReviewSubmitting(false);
    }
  };
  
  const getRatingDistribution = () => {
    if (reviewCount === 0) return [0, 0, 0, 0, 0];
    const distribution = [0, 0, 0, 0, 0];
    productReviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution.map(count => (count / reviewCount) * 100).reverse();
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
                  <span className="ml-1 font-body-semibold">{averageRating.toFixed(1)}</span>
                  <span className="font-body text-gray-500 ml-1">({reviewCount})</span>
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
                          {variant.name}
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

        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="description" className="font-body-semibold">Descrição</TabsTrigger>
              <TabsTrigger value="specifications" className="font-body-semibold">Especificações</TabsTrigger>
              <TabsTrigger value="reviews" className="font-body-semibold">Avaliações ({reviewCount})</TabsTrigger>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 border-b md:border-b-0 md:border-r pb-8 md:pb-0 md:pr-8">
                      <h3 className="font-title text-xl font-body-semibold mb-4">Avaliação Geral</h3>
                      {reviewCount > 0 ? (
                        <>
                          <div className="flex items-center space-x-2 mb-4">
                            <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
                            <div>
                              <RatingStars rating={averageRating} />
                              <p className="text-sm text-gray-600">Baseado em {reviewCount} avaliações</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {getRatingDistribution().map((percentage, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{5 - index} estrelas</span>
                                <Progress value={percentage} className="w-full h-2" />
                                <span className="text-sm text-gray-500 w-10 text-right">{percentage.toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Ainda não há avaliações para este produto.</p>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="font-title text-xl font-body-semibold mb-4">Avaliações dos Clientes</h3>
                      
                      {reviewCount > 0 ? (
                        <div className="space-y-6 mb-8">
                          {productReviews.map(review => (
                            <div key={review.id} className="border-b pb-6 last:border-b-0">
                              <div className="flex items-center mb-2">
                                <RatingStars rating={review.rating} />
                                {review.verifiedPurchase && <Badge variant="secondary" className="ml-3 text-green-700 bg-green-100"><CheckCircle className="h-3 w-3 mr-1" /> Compra Verificada</Badge>}
                              </div>
                              <p className="text-gray-700 mb-2">{review.comment}</p>
                              <div className="flex space-x-2">
                                {review.images?.map((img, i) => <img key={i} src={img} alt="review image" className="w-16 h-16 rounded-md object-cover" />)}
                              </div>
                              <p className="text-sm text-gray-500 mt-2">por <span className="font-semibold">{review.author}</span> • {review.date}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Seja o primeiro a avaliar este produto!
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-title text-xl font-body-semibold mb-4">Deixe sua avaliação</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          <div>
                            <Label>Sua nota</Label>
                            <div className="flex space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <button type="button" key={i} onClick={() => setNewReviewRating(i + 1)}>
                                  <Star className={`h-6 w-6 transition-colors ${i < newReviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="review-comment">Seu comentário</Label>
                            <Textarea 
                              id="review-comment" 
                              placeholder="Conte-nos sobre sua experiência..." 
                              value={newReviewComment}
                              onChange={(e) => setNewReviewComment(e.target.value)}
                            />
                          </div>
                          {/* Removido input de imagem para simplificar o formulário inline */}
                          <Button type="submit" disabled={isReviewSubmitting}>
                            {isReviewSubmitting ? "Enviando..." : "Enviar Avaliação"}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
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
                              <span className="text-gray-600 font-bold text-sm">{product.shop.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-body text-gray-800">{item.answer}</p>
                              <p className="text-sm text-gray-500">respondido por {product.shop.name} • {item.date}</p>
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