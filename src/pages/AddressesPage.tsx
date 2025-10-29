"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MapPin, Edit, Trash2, CheckCircle, Plus, LocateFixed, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getCustomerAddresses, upsertCustomerAddress, setActiveAddress, deleteCustomerAddress, CustomerAddress } from '@/api/addresses';
import LocationPicker from '@/components/LocationPicker';
import { Badge } from '@/components/ui/badge'; // Adicionado Badge

const initialAddressState: Partial<CustomerAddress> = {
  name: '',
  full_address: '',
  city: '',
  district: '',
  state: 'Maputo',
  zip_code: '',
  latitude: null,
  longitude: null,
  is_active: false,
};

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: Partial<CustomerAddress>;
  setCurrentAddress: React.Dispatch<React.SetStateAction<Partial<CustomerAddress>>>;
  handleSave: (e: React.FormEvent) => Promise<void>;
  isSaving: boolean;
  isLocationPickerOpen: boolean;
  setIsLocationPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLocationSave: (lat: number, lng: number) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  setCurrentAddress,
  handleSave,
  isSaving,
  isLocationPickerOpen,
  setIsLocationPickerOpen,
  handleLocationSave,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{currentAddress.id ? "Editar Endereço" : "Adicionar Novo Endereço"}</DialogTitle>
        </DialogHeader>
        
        {isLocationPickerOpen ? (
          <LocationPicker
            initialLat={currentAddress.latitude}
            initialLng={currentAddress.longitude}
            onSave={handleLocationSave}
            onClose={() => setIsLocationPickerOpen(false)}
          />
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Endereço *</Label>
              <Input
                id="name"
                name="name"
                value={currentAddress.name || ''}
                onChange={handleInputChange}
                placeholder="Ex: Casa, Trabalho"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  name="city"
                  value={currentAddress.city || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Bairro/Distrito</Label>
                <Input
                  id="district"
                  name="district"
                  value={currentAddress.district || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full_address">Rua, Avenida ou Número da Casa *</Label>
              <Textarea
                id="full_address"
                name="full_address"
                value={currentAddress.full_address || ''}
                onChange={handleInputChange}
                rows={2}
                required
              />
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold text-sm">Localização GPS (Opcional)</h4>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {currentAddress.latitude && currentAddress.longitude 
                    ? `Lat: ${currentAddress.latitude.toFixed(4)}, Lng: ${currentAddress.longitude?.toFixed(4)}`
                    : "Coordenadas não definidas."
                  }
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsLocationPickerOpen(true)}
                >
                  <LocateFixed className="h-4 w-4 mr-2" />
                  {currentAddress.latitude ? "Editar GPS" : "Definir GPS"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar Endereço"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};


export default function AddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<CustomerAddress>>(initialAddressState);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomerAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error("Falha ao carregar endereços.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleEdit = (address: CustomerAddress) => {
    setCurrentAddress(address);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setCurrentAddress(initialAddressState);
    setIsModalOpen(true);
  };

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAddress.name || !currentAddress.full_address || !currentAddress.city) {
      toast.error("Nome, endereço completo e cidade são obrigatórios.");
      return;
    }
    
    setIsSaving(true);
    try {
      await upsertCustomerAddress(currentAddress);
      toast.success("Endereço salvo com sucesso!");
      setIsModalOpen(false);
      fetchAddresses();
    } catch (error) {
      toast.error("Falha ao salvar endereço.");
    } finally {
      setIsSaving(false);
    }
  }, [currentAddress, fetchAddresses]);
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este endereço?")) {
      try {
        await deleteCustomerAddress(id);
        toast.success("Endereço deletado.");
        fetchAddresses();
      } catch (error) {
        toast.error("Falha ao deletar endereço.");
      }
    }
  };
  
  const handleSetActive = async (id: string) => {
    try {
      await setActiveAddress(id);
      toast.success("Endereço definido como ativo.");
      fetchAddresses();
    } catch (error) {
      toast.error("Falha ao definir endereço ativo.");
    }
  };
  
  const handleLocationSave = useCallback((lat: number, lng: number) => {
    setCurrentAddress(prev => ({ ...prev, latitude: lat, longitude: lng }));
    setIsLocationPickerOpen(false);
    toast.info(`Coordenadas salvas: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/account')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-title text-3xl ml-3 text-gray-900 dark:text-white">Endereços de Entrega</h1>
          </div>
          <Button onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Endereço
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando endereços...</p>
          </div>
        ) : addresses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum endereço cadastrado. Adicione um para facilitar o checkout.</p>
              <Button className="mt-4" onClick={handleNew}>
                Adicionar Primeiro Endereço
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card 
                key={address.id} 
                className={`border transition-all ${address.is_active ? 'border-blue-500 shadow-md bg-blue-50/50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800'}`}
              >
                <CardContent className="p-4 flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="font-semibold text-lg">{address.name}</h2>
                      {address.is_active && (
                        <Badge className="bg-blue-600 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" /> Ativo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {address.full_address}, {address.district}, {address.city}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <LocateFixed className="h-4 w-4 mr-2 text-gray-500" />
                      GPS: {address.latitude ? `${address.latitude.toFixed(4)}, ${address.longitude?.toFixed(4)}` : 'Não definido'}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 flex-shrink-0">
                    {!address.is_active && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSetActive(address.id)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-100"
                      >
                        Definir Ativo
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(address.id)} className="text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsLocationPickerOpen(false); // Fecha o picker se o modal principal fechar
        }}
        currentAddress={currentAddress}
        setCurrentAddress={setCurrentAddress}
        handleSave={handleSave}
        isSaving={isSaving}
        isLocationPickerOpen={isLocationPickerOpen}
        setIsLocationPickerOpen={setIsLocationPickerOpen}
        handleLocationSave={handleLocationSave}
      />
    </div>
  );
}