"use client";

import { useState } from "react";
import { Fingerprint, ScanFace, Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { registerBiometric } from "@/utils/biometricAuth";

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
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setIsRegistering(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await registerBiometric({
        userId,
        email,
      });

      if (result.success) {
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
    if (navigator.userAgent.includes('Android')) {
      return <Fingerprint className="h-6 w-6 text-blue-600" />;
    } else {
      return <ScanFace className="h-6 w-6 text-blue-600" />;
    }
  };

  const getPlatformName = () => {
    if (navigator.userAgent.includes('Android')) {
      return 'Fingerprint';
    } else {
      return 'Face ID / Touch ID';
    }
  };

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
          <h3 className="font-semibold text-lg">Enable {getPlatformName()}</h3>
          <p className="text-sm text-gray-600 mt-2">
            Add an extra layer of security to your account using {getPlatformName()}.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Benefits:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2" />
              Quick and secure login
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2" />
              No need to remember passwords
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2" />
              Protected by device security
            </li>
          </ul>
        </div>

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">Biometric authentication enabled successfully!</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
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
              Setting up...
            </>
          ) : (
            `Enable ${getPlatformName()}`
          )}
        </Button>

        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Requires {getPlatformName()} support
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}