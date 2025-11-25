"use client";

import React, { useState } from "react";
import { Fingerprint, ScanFace, Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNativeBiometrics } from "@/hooks/useNativeBiometrics"; // Usando o novo hook

interface BiometricLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onFallback?: () => void;
}

export default function BiometricLogin({ 
  onSuccess, 
  onError, 
  onFallback 
}: BiometricLoginProps) {
  const { 
    isAvailable, 
    loading: isCheckingAvailability, 
    authenticate, 
    error: biometricsError 
  } = useNativeBiometrics();
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combina erros do hook e erros locais
  const displayError = error || biometricsError;

  const handleBiometricLogin = async () => {
    setIsAuthenticating(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await authenticate("Use sua biometria para acessar o Lumi Market");

      if (result.success) {
        // Simulação de login bem-sucedido (em um app real, isso viria de uma API)
        setIsSuccess(true);
        onSuccess?.();
      } else {
        setError(result.error || 'Authentication failed');
        onError?.(result.error || 'Authentication failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getPlatformIcon = () => {
    // Capacitor Biometrics lida com Face ID/Touch ID/Fingerprint automaticamente
    return <ScanFace className="h-6 w-6 text-blue-600" />;
  };

  const getPlatformName = () => {
    // Nome genérico para cobrir todas as biometrias
    return 'Biometria (Face ID / Touch ID / Fingerprint)';
  };

  if (isCheckingAvailability) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Biometria Não Disponível</h3>
          <p className="text-gray-600 mb-4">
            Seu dispositivo não suporta ou a biometria não está configurada.
          </p>
          <Button onClick={onFallback} variant="outline">
            Usar Senha
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Biometric Login</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getPlatformIcon()}
          </div>
          <h3 className="font-semibold text-lg">Login com Biometria</h3>
          <p className="text-sm text-gray-600 mt-2">
            Use sua biometria para rapidamente e seguramente acessar sua conta.
          </p>
        </div>

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">Login successful! Redirecting...</span>
          </div>
        )}

        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{displayError}</span>
          </div>
        )}

        <Button 
          onClick={handleBiometricLogin} 
          disabled={isAuthenticating}
          className="w-full"
        >
          {isAuthenticating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Autenticando...
            </>
          ) : (
            `Login com Biometria`
          )}
        </Button>

        <div className="text-center">
          <Button 
            onClick={onFallback} 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            Usar Senha
          </Button>
        </div>

        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Login seguro
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}