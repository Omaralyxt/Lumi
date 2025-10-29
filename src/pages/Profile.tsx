"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { User, Edit, MapPin, Phone, Mail, Shield, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { getCustomerProfile, upsertCustomerProfile, CustomerProfile } from "@/api/customer";
import { toast } from "sonner";
import Loading from "@/components/Loading";

// Estado inicial do formulário (vazio ou com defaults)
const initialFormData: Partial<CustomerProfile> = {
  full_name: "",
  email: "",
  phone: "",
  alternative_phone: "",
  shipping_address: "",
  city: "",
  district: "",
  state: "Maputo",
  zip_code: "",
};

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CustomerProfile>>(initialFormData);
  const [dataLoading, setDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const profileData = await getCustomerProfile(user.id);
      
      if (profileData) {
        // Se o perfil existir, preenche o formulário
        setFormData(profileData);
      } else {
        // Se não existir, usa dados básicos do auth.user
        setFormData({
          full_name: user.user_metadata.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          phone: user.user_metadata.phone || '',
          // Outros campos permanecem vazios/default
        });
      }
    } catch (error) {
      toast.error("Falha ao carregar dados do perfil.");
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchProfile();
    }
  }, [user, authLoading, fetchProfile]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const updatedProfile = await upsertCustomerProfile(formData);
      setFormData(updatedProfile);
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao salvar perfil.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  if (authLoading || dataLoading) {
    return <Loading />;
  }
  
  if (!user) {
    return <div className="text-center py-12 text-red-500">Acesso negado. Faça login para ver seu perfil.</div>;
  }

  // Dados a serem exibidos (usando formData, que é preenchido com dados reais)
  const displayData = formData;
  const joinedAt = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-MZ', { year: 'numeric', month: 'long' }) : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6 border dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayData.full_name || 'Usuário Lumi'}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">Membro desde {joinedAt}</Badge>
                {/* Mocked stats removed for simplicity */}
              </div>
            </div>
            <Button onClick={handleEdit} variant="outline" disabled={isSaving}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Informações Pessoais e de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome Completo */}
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name || ''}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{displayData.full_name || 'N/A'}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <p className="text-gray-900 dark:text-white font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {displayData.email || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">O email só pode ser alterado nas configurações de segurança.</p>
              </div>
              
              {/* Telefone Principal */}
              <div>
                <Label htmlFor="phone">Telefone Principal</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="+258 8x xxx xxxx"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {displayData.phone || 'N/A'}
                  </p>
                )}
              </div>
              
              {/* Telefone Alternativo */}
              <div>
                <Label htmlFor="alternative_phone">Telefone Alternativo</Label>
                {isEditing ? (
                  <Input
                    id="alternative_phone"
                    name="alternative_phone"
                    value={formData.alternative_phone || ''}
                    onChange={handleInputChange}
                    placeholder="+258 8x xxx xxxx (Opcional)"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {displayData.alternative_phone || 'N/A'}
                  </p>
                )}
              </div>
            </div>
            
            <h3 className="font-title text-xl pt-4 border-t mt-6">Endereço de Entrega</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cidade */}
              <div>
                <Label htmlFor="city">Cidade</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{displayData.city || 'N/A'}</p>
                )}
              </div>
              
              {/* Bairro/Distrito */}
              <div>
                <Label htmlFor="district">Bairro/Distrito</Label>
                {isEditing ? (
                  <Input
                    id="district"
                    name="district"
                    value={formData.district || ''}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{displayData.district || 'N/A'}</p>
                )}
              </div>
              
              {/* Província/Estado */}
              <div>
                <Label htmlFor="state">Província</Label>
                {isEditing ? (
                  <Input
                    id="state"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{displayData.state || 'N/A'}</p>
                )}
              </div>
            </div>
            
            {/* Endereço (Rua/Casa) */}
            <div>
              <Label htmlFor="shipping_address">Rua, Avenida ou Número da Casa</Label>
              {isEditing ? (
                <Textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={formData.shipping_address || ''}
                  onChange={handleInputChange}
                  rows={2}
                  required
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  {displayData.shipping_address || 'N/A'}
                </p>
              )}
            </div>
            
            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Security (Mantido como placeholder) */}
        <Card className="mt-6 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Segurança da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">Gerencie sua senha e outras configurações de segurança na página de Configurações.</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings">Ir para Configurações</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}