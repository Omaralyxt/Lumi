import { browserLocalPersistence, browserSessionPersistence, getAuth, signInWithCustomToken } from "@supabase/auth-helpers-nextjs";
import { createBrowserClient } from "@supabase/auth-helpers-react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

// Initialize Supabase client for biometric operations
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface BiometricRegistrationOptions {
  userId: string;
  email: string;
  deviceName?: string;
}

export interface BiometricLoginOptions {
  deviceName?: string;
}

// Function to register biometric credentials
export async function registerBiometric(options: BiometricRegistrationOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId, email, deviceName = "Default Device" } = options;

    // Generate a challenge for registration
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Prepare registration options
    const registrationOptions = {
      challenge: challenge,
      rp: {
        name: "Lumi Marketplace",
        id: window.location.hostname
      },
      user: {
        id: new TextEncoder().encode(userId),
        name: email,
        displayName: email
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "direct"
    };

    // Start registration
    const registrationResponse = await startRegistration(registrationOptions);

    // Store the credential in Supabase
    const { error } = await supabase
      .from('user_biometrics')
      .insert({
        user_id: userId,
        device_id: deviceName,
        public_key: JSON.stringify(registrationResponse),
        platform: navigator.userAgent.includes('Android') ? 'android' : 'ios',
        created_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Biometric registration failed:', error);
    return { success: false, error: error.message };
  }
}

// Function to authenticate with biometrics
export async function authenticateBiometric(options: BiometricLoginOptions = {}): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const { deviceName } = options;

    // Generate a challenge for authentication
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Prepare authentication options
    const authenticationOptions = {
      challenge: challenge,
      timeout: 60000,
      userVerification: "required"
    };

    // Start authentication
    const authenticationResponse = await startAuthentication(authenticationOptions);

    // Send the response to the backend for verification
    const response = await fetch('/api/auth/biometric-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        credential: authenticationResponse,
        deviceName
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Biometric authentication failed');
    }

    // Sign in with the custom token from Supabase
    const { error } = await supabase.auth.setSession({
      access_token: data.token,
      refresh_token: data.refreshToken
    });

    if (error) {
      throw error;
    }

    return { success: true, token: data.token };
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    return { success: false, error: error.message };
  }
}

// Function to check if biometric authentication is available
export async function isBiometricAvailable(): Promise<boolean> {
  try {
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      return false;
    }

    // Try to get existing credentials (this will fail if none exist, but we just want to check availability)
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const authenticationOptions = {
      challenge: challenge,
      timeout: 60000,
      userVerification: "required"
    };

    // This will throw if no credentials are registered, but we don't care about that for availability check
    await startAuthentication(authenticationOptions);
    return true;
  } catch (error) {
    // If it fails, it might be because no credentials are registered, but WebAuthn is still available
    // We'll return true if WebAuthn is supported, regardless of credentials
    return !!window.PublicKeyCredential;
  }
}