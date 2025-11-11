"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Package, 
  DollarSign, 
  Package2,
  Tag,
  FileText,
  Minus,
  Plus as PlusIcon,
  Save,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ProductVariant } from "@/types/product";
import { getFlatCategories } from "@/constants/categories"; // Importar a nova função

// Tipos de entrada para a função RPC
interface VariantInput {
  id: string | null;
  name: string;
  price: number;
  stock: number;
}

interface ImageInput {
  id: string | null;
  image_url: string;
  sort_order: number;
  is_deleted: boolean;
}

// Obter a lista plana de categorias
const flatCategories = getFlatCategories();

// Estado inicial para uma variante
const initialVariant: VariantInput = {
  id: null,
  name: "Padrão",
  price: 0,
  stock: 0,
};

export default function CreateProduct() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null); // Para edição
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"product" | "service">("product");
  
  const [variants, setVariants] = useState<VariantInput[]>([initialVariant]);
  const [images, setImages] = useState<ImageInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Simulação de carregamento do Store ID do usuário logado
  useEffect(() => {
    const fetchStoreId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Em um app real, buscaríamos o store_id do perfil ou da tabela stores
        // Vamos simular que o store_id é o ID do usuário por enquanto, ou buscar a primeira loja
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('seller_id', user.id)
          .single();
          
        if (storeData) {
          setStoreId(storeData.id);
        } else {
          setError("Você precisa ter uma loja registrada para criar produtos.");
        }
      }
    };
    fetchStoreId();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!storeId) {
      toast.error("Erro: ID da loja não encontrado.");
      return;
    }
    
    setLoading(true);
    
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${storeId}/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images') // Assumindo que o bucket 'product-images' existe
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const publicUrl = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath).data.publicUrl;
          
        setImages(prev => [
          ...prev, 
          { 
            id: null, 
            image_url: publicUrl, 
            sort_order: prev.length, 
            is_deleted: false 
          }
        ]);
      }
      toast.success("Imagens carregadas com sucesso!");
    } catch (err: any) {
      toast.error(`Falha ao fazer upload: ${err.message}`);
      setError(`Falha ao fazer upload: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantInput, value: string | number) => {
    setVariants(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, initialVariant]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) {
      toast.error("Erro: ID da loja não encontrado. Não é possível publicar.");
      return;
    }
    if (!title || !description || !category || images.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios e adicione pelo menos uma imagem.");
      return;
    }
    if (variants.some(v => v.price <= 0 || (type === 'product' && v.stock < 0))) {
      toast.error("Preço deve ser maior que zero e estoque não pode ser negativo.");
      return;
    }

    setLoading(true);
    setError("");
    const loadingToastId = toast.loading("Publicando produto...");

    try {
      // Mapear variantes para o formato RPC
      const rpcVariants: VariantInput[] = variants.map(v => ({
        ...v,
        price: Number(v.price),
        stock: Number(v.stock),
      }));
      
      // Mapear imagens para o formato RPC (assumindo que nenhuma foi deletada ainda)
      const rpcImages: ImageInput[] = images.map((img, index) => ({
        ...img,
        sort_order: index,
      }));

      const { data, error: rpcError } = await supabase.rpc('upsert_product_full', {
        p_product_id: productId,
        p_store_id: storeId,
        p_name: title,
        p_description: description,
        p_shipping_cost: shippingCost,
        p_category: category,
        p_variants: rpcVariants,
        p_images: rpcImages,
      });

      if (rpcError) {
        throw rpcError;
      }

      toast.dismiss(loadingToastId);
      toast.success("Produto publicado com sucesso!");
      
      // Resetar formulário ou preparar para edição do produto recém-criado
      setProductId(data);
      // Limpar formulário (opcional, dependendo do fluxo)
      // setFormData({ ... });
      
    } catch (err: any) {
      toast.dismiss(loadingToastId);
      const errorMessage = err.message || "Falha ao cadastrar produto.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Simulação de Especificações (mantida simples)
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([{key: "", value: ""}]);
  const addSpecification = () => setSpecifications(prev => [...prev, {key: "", value: ""}]);
  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setSpecifications(prev => prev.map((spec, i) => i === index ? {...spec, [field]: value} : spec));
  };
  const removeSpecification = (index: number) => setSpecifications(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-900 dark:border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {productId ? "Editar Produto" : "Criar Produto/Serviço"}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button size="sm" onClick={handleSubmit} disabled={loading || !storeId}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        {!storeId && !loading && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Aguardando ID da loja. Certifique-se de que sua loja está registrada.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Package className="h-5 w-5 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Smartphone Samsung Galaxy A54 5G"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select value={type} onValueChange={(value) => setType(value as "product" | "service")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Produto</SelectItem>
                      <SelectItem value="service">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Custo de Envio (MZN)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="shippingCost"
                      type="number"
                      placeholder="150"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {flatCategories.map((c) => (
                        <SelectItem key={c.id} value={c.nome}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva seu produto/serviço em detalhes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Product Variants (Preço e Estoque) */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Tag className="h-5 w-5 mr-2" />
                Variantes e Preços *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-4 gap-3 items-end border-b pb-4 last:border-b-0">
                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <Label className="text-sm">Nome da Variante</Label>
                    <Input
                      placeholder="Ex: Cor Azul, Tamanho M"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <Label className="text-sm">Preço (MZN)</Label>
                    <Input
                      type="number"
                      placeholder="12500"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))}
                      required
                      min={1}
                    />
                  </div>
                  {type === "product" && (
                    <div className="col-span-2 md:col-span-1 space-y-2">
                      <Label className="text-sm">Estoque</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="15"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                          required
                          min={0}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          disabled={variants.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {type === "service" && (
                    <div className="col-span-4 md:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        disabled={variants.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addVariant}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Adicionar Variante
              </Button>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Package2 className="h-5 w-5 mr-2" />
                Imagens do Produto *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image.image_url} 
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors dark:border-gray-600">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Adicionar imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              
              <p className="text-sm text-gray-500">
                Adicione pelo menos 1 imagem. Formatos: JPG, PNG. Máx: 5MB por imagem.
              </p>
            </CardContent>
          </Card>

          {/* Technical Specifications (Mantido simples) */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <FileText className="h-5 w-5 mr-2" />
                Especificações Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <div className="space-y-2">
                    <Label className="text-sm">Atributo</Label>
                    <Input
                      placeholder="Ex: Marca"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Valor</Label>
                    <Input
                      placeholder="Ex: Samsung"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSpecification(index)}
                    disabled={specifications.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addSpecification}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Adicionar Especificação
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}