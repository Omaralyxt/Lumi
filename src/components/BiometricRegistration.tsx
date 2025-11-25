"use client";

import { useState, useEffect } from "react";
import { Fingerprint, ScanFace, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNativeBiometrics } from "@/hooks/useNativeBiometrics"; // Usando o novo hook

interface BiometricRegistrationProps {
  userId: string;
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function BiometricRegistration({ 
  userId, 
  email, 
  onSuccess, 
  onError 
}: BiometricRegistrationProps) {
  const { 
    isAvailable, 
    loading: isCheckingAvailability, 
    authenticate, 
    error: biometricsError 
  } = useNativeBiometrics();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    // No Capacitor Biometrics, "registrar" é apenas verificar se o usuário pode autenticar
    // e, se sim, salvar uma flag localmente (ou no Supabase) de que a biometria está ATIVA.
    
    if (!isAvailable) {
      setError("Biometria não disponível no dispositivo.");
      return;
    }
    
    setIsRegistering(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Simula a autenticação para garantir que o usuário pode usar a biometria
      const result = await authenticate("Confirme para ativar o login biométrico");

      if (result.success) {
        // Aqui você faria uma chamada à API para salvar que o usuário ativou a biometria
        // Ex: await supabase.from('profiles').update({ biometric_enabled: true }).eq('id', userId);
        
        setIsSuccess(true);
        onSuccess?.();
      } else {
        setError(result.error || 'Registration failed');
        onError?.(result.error || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const getPlatformIcon = () => {
    return <ScanFace className="h-6 w-6 text-blue-600" />;
  };

  const getPlatformName = () => {
    return 'Biometria (Face ID / Touch ID / Fingerprint)';
  };
  
  if (isCheckingAvailability) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (!isAvailable) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Biometria Não Suportada</h3>
          <p className="text-gray-600 mb-4">
            Esta funcionalidade só está disponível em aplicativos nativos com biometria configurada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Biometric Security</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getPlatformIcon()}
          </div>
          <h3 className="font-semibold text-lg">Enable Biometria</h3>
          <p className="text-sm text-gray-600 mt-2">
            Adicione uma camada extra de segurança à sua conta usando {getPlatformName()}.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Benefícios:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2" />
              Login rápido e seguro
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2" />
              Não precisa de senha
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2" />
              Protegido pela segurança do dispositivo
            </li>
          </ul>
        </div>

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">Biometria ativada com sucesso!</span>
          </div>
        )}

        {(error || biometricsError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error || biometricsError}</span>
          </div>
        )}

        <Button 
          onClick={handleRegister} 
          disabled={isRegistering}
          className="w-full"
        >
          {isRegistering ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Ativando...
            </>
          ) : (
            `Ativar Biometria`
          )}
        </Button>

        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Requer biometria configurada no dispositivo
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}