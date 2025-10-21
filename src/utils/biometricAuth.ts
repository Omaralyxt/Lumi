import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

export interface BiometricRegistrationOptions {
  userId: string;
  email: string;
}

// Função para verificar se a biometria está disponível e configurada
export async function isBiometricAvailable(): Promise<boolean> {
  if (window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
    return true;
  }
  return false;
}

// Função para registrar credenciais biométricas
export async function registerBiometric(options: BiometricRegistrationOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId, email } = options;

    // 1. Obter o desafio do servidor
    // Em um app real, faria um fetch para /api/biometric/register-challenge
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const registrationOptions = {
      challenge,
      rp: { name: "Lumi Marketplace", id: window.location.hostname },
      user: {
        id: new TextEncoder().encode(userId),
        name: email,
        displayName: email,
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
      timeout: 60000,
      attestation: "none",
    };

    const registrationResponse = await startRegistration(registrationOptions);

    // 2. Enviar a resposta para o servidor para verificação e salvamento
    const token = localStorage.getItem("lumi_token");
    const verifyResponse = await fetch('/api/biometric/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ credential: registrationResponse }),
    });

    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok) throw new Error(verifyData.error);

    return { success: true };
  } catch (error: any) {
    console.error('Falha no registro biométrico:', error);
    if (error.name === 'NotAllowedError') {
        return { success: false, error: 'O registro foi cancelado.' };
    }
    return { success: false, error: error.message || 'Ocorreu um erro desconhecido.' };
  }
}

// Função para autenticar com biometria
export async function authenticateBiometric(): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Obter o desafio do servidor
    // Em um app real, faria um fetch para /api/biometric/login-challenge
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const authenticationOptions = {
      challenge,
      rpId: window.location.hostname,
      userVerification: "required",
      timeout: 60000,
    };

    const authenticationResponse = await startAuthentication(authenticationOptions);

    // 2. Enviar a resposta para o servidor para verificação
    const verifyResponse = await fetch('/api/biometric/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assertion: authenticationResponse }),
    });

    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok) throw new Error(verifyData.error);

    // 3. Salvar o token e perfil do usuário
    localStorage.setItem("lumi_token", verifyData.token);
    localStorage.setItem("lumi_profile", JSON.stringify(verifyData.profile));

    return { success: true };
  } catch (error: any) {
    console.error('Falha na autenticação biométrica:', error);
    if (error.name === 'NotAllowedError') {
        return { success: false, error: 'A autenticação foi cancelada.' };
    }
    return { success: false, error: error.message || 'Ocorreu um erro desconhecido.' };
  }
}