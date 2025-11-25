import { isPlatform } from '@capacitor/core';

export interface BiometricRegistrationOptions {
  userId: string;
  email: string;
}

// Verifica se estamos em uma plataforma nativa (iOS/Android)
const isNative = isPlatform('ios') || isPlatform('android');

// Função para verificar se a biometria está disponível e configurada
export async function isBiometricAvailable(): Promise<boolean> {
  if (isNative) {
    // No ambiente nativo, a verificação será feita pelo useNativeBiometrics
    return true; 
  }
  
  // Fallback para WebAuthn (apenas para navegadores que suportam)
  if (window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
    return true;
  }
  return false;
}

// Função para registrar credenciais biométricas (MOCKADO/REMOVIDO)
export async function registerBiometric(options: BiometricRegistrationOptions): Promise<{ success: boolean; error?: string }> {
  if (isNative) {
    // No app nativo, o registro é gerenciado pelo sistema operacional.
    return { success: true };
  }
  
  // Lógica WebAuthn removida para simplificar o foco no Capacitor
  console.warn("WebAuthn registration is not implemented in this version.");
  return { success: false, error: 'WebAuthn registration not supported in this context.' };
}

// Função para autenticar com biometria (MOCKADO/REMOVIDO)
export async function authenticateBiometric(): Promise<{ success: boolean; error?: string }> {
  if (isNative) {
    // No app nativo, a autenticação será feita pelo useNativeBiometrics
    return { success: true };
  }
  
  // Lógica WebAuthn removida para simplificar o foco no Capacitor
  console.warn("WebAuthn authentication is not implemented in this version.");
  return { success: false, error: 'WebAuthn authentication not supported in this context.' };
}