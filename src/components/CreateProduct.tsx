"use client";

import { useState } from "react";
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
  Settings,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  { id: 1, name: "Eletrónicos" },
  { id: 2, name: "Moda" },
  { id: 3, name: "Casa & Cozinha" },
  { id: 4, name: "Saúde & Beleza" },
  { id: 5, name: "Desporto" },
  { id: 6, name: "Livros" },
  { id: 7, name: "Bebés & Crianças" },
  { id: 8, name: "Automóvel" },
  { id: 9, name: "Serviços" },
  { id: 10, name: "Outros" },
];

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    type: "product", // 'product' ou 'service'
    image_url: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([{key: "", value: ""}]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setLoading(true);
    
    try {
      const token = localStorage.getItem("lumi_token");
      if (!token) {
        setError("Por favor, faça login primeiro");
        return;
      }

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/seller/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setImages(prev => [...prev, data.url]);
        } else {
          setError("Falha ao fazer upload da imagem");
        }
      }
    } catch (err) {
      setError("Erro de rede ao fazer upload");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("lumi_token");
      if (!token) {
        setError("Por favor, faça login primeiro");
        return;
      }

      const response = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          image_url: images[0] || "",
          features,
          specifications
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Produto cadastrado com sucesso!");
        // Limpar formulário
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          type: "product",
          image_url: "",
        });
        setImages([]);
        setFeatures([""]);
        setSpecifications([{key: "", value: ""}]);
      } else {
        setError(data.error || "Falha ao cadastrar produto");
      }
    } catch (err) {
      setError("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setFeatures(prev => [...prev, ""]);
  };

  const updateFeature = (index: number, value: string) => {
    setFeatures(prev => prev.map((f, i) => i === index ? value : f));
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    setSpecifications(prev => [...prev, {key: "", value: ""}]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setSpecifications(prev => prev.map((spec, i) => i === index ? {...spec, [field]: value} : spec));
  };

  const removeSpecification = (index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Criar Produto/Serviço</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">Rascunho</Button>
              <Button size="sm" onClick={handleSubmit} disabled={loading}>
                {loading ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
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
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
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
                  <Label htmlFor="price">Preço (MTN) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="12500"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {formData.type === "product" && (
                  <div className="space-y-2">
                    <Label htmlFor="stock">Estoque *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="15"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
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
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package2 className="h-5 w-5 mr-2" />
                Imagens do Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
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
                
                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Adicionar imagem</span>
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

          {/* Product Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Características
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Ex: Tela AMOLED 6.4 polegadas"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    disabled={features.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Adicionar Característica
              </Button>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
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