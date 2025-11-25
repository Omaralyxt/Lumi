"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, LocateFixed, AlertCircle, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Geolocation } from '@capacitor/geolocation';
import { isPlatform } from '@capacitor/core';

interface LocationPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onSave: (lat: number, lng: number) => void;
  onClose: () => void;
}

// Verifica se estamos em um ambiente nativo
const isNative = isPlatform('ios') || isPlatform('android');

export default function LocationPicker({ initialLat, initialLng, onSave, onClose }: LocationPickerProps) {
  const [latitude, setLatitude] = useState<number | null>(initialLat || null);
  const [longitude, setLongitude] = useState<number | null>(initialLng || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocateMe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let position;
      
      if (isNative) {
        // Usar Capacitor Geolocation
        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else if (navigator.geolocation) {
        // Fallback para Web Geolocation API
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });
      } else {
        throw new Error("Geolocalização não é suportada pelo seu navegador/plataforma.");
      }

      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      toast.success("Localização atualizada via GPS!");
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Falha ao obter a localização.";
      if (err.message.includes('denied')) {
        errorMessage = "Permissão de localização negada. Por favor, habilite nas configurações do dispositivo.";
      } else if (err.message.includes('timeout')) {
        errorMessage = "Tempo esgotado ao buscar localização.";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = () => {
    if (latitude === null || longitude === null) {
      setError("Por favor, defina a latitude e longitude.");
      return;
    }
    onSave(latitude, longitude);
  };

  // Simulação de Mapa (Visual Placeholder)
  const MapPlaceholder = () => (
    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
      <MapPin className="h-10 w-10 text-blue-600 animate-pulse" />
      <p className="absolute bottom-2 text-sm text-gray-600 dark:text-gray-300">
        {latitude !== null && longitude !== null ? `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}` : "Aguardando localização..."}
      </p>
    </div>
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Definir Localização GPS
        </h3>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <MapPlaceholder />

        <Button 
          onClick={handleLocateMe} 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Localizando...
            </>
          ) : (
            <>
              <LocateFixed className="h-4 w-4 mr-2" />
              Usar Minha Localização Atual (GPS)
            </>
          )}
        </Button>

        <div className="flex items-center justify-between text-gray-500">
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          <span className="px-3 text-sm">OU</span>
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={latitude ?? ''}
              onChange={(e) => setLatitude(Number(e.target.value))}
              placeholder="Ex: -25.9653"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={longitude ?? ''}
              onChange={(e) => setLongitude(Number(e.target.value))}
              placeholder="Ex: 32.5872"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          <Button onClick={handleSave} disabled={latitude === null || longitude === null}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Coordenadas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}