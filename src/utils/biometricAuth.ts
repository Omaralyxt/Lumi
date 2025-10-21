import { startRegistration } from "@simplewebauthn/browser";

export interface BiometricRegistrationOptions {
  userId: string;
  email: string;
}

// Função para registrar credenciais biométricas
export async function registerBiometric(options: BiometricRegistrationOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId, email } = options;

    // Normalmente, você obteria isso do servidor
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
      attestation: "none", // Usar 'none' para simplicidade na simulação
    };

    const registrationResponse = await startRegistration(registrationOptions);

    // Enviar a resposta para o backend para ser salva
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

    if (!verifyResponse.ok) {
      throw new Error(verifyData.error || 'Falha ao salvar credencial no servidor.');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Falha no registro biométrico:', error);
    if (error.name === 'NotAllowedError') {
        return { success: false, error: 'O registro foi cancelado.' };
    }
    return { success: false, error: error.message || 'Ocorreu um erro desconhecido.' };
  }
}