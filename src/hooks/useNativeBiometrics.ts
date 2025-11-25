"use client";

import { useState, useEffect, useCallback } from 'react';
import { Biometrics } from '@capacitor/biometrics';
import { isPlatform } from '@capacitor/core';

// Verifica se estamos em uma plataforma nativa (iOS/Android)
const isNative = isPlatform('ios') || isPlatform('android');

interface BiometricsState {
  isAvailable: boolean | null;
  loading: boolean;
  error: string | null;
}

export function useNativeBiometrics() {
  const [state, setState] = useState<BiometricsState>({
    isAvailable: null,
    loading: true,
    error: null,
  });

  const checkAvailability = useCallback(async () => {
    if (!isNative) {
      setState({ isAvailable: false, loading: false, error: 'Not a native platform.' });
      return false;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await Biometrics.isAvailable();
      setState({ isAvailable: result.isAvailable, loading: false, error: null });
      return result.isAvailable;
    } catch (e: any) {
      console.error("Biometrics check failed:", e);
      setState({ isAvailable: false, loading: false, error: e.message || 'Biometrics check failed' });
      return false;
    }
  }, []);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const authenticate = useCallback(async (reason: string = "Autenticação rápida") => {
    if (!state.isAvailable) {
      return { success: false, error: 'Biometrics not available or not native.' };
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await Biometrics.verify({ reason });
      
      if (result.verified) {
        // Em um app real, você faria a chamada de login silencioso aqui, 
        // mas para este exemplo, simulamos o sucesso.
        setState(prev => ({ ...prev, loading: false }));
        return { success: true };
      } else {
        setState(prev => ({ ...prev, loading: false, error: 'Autenticação biométrica falhou.' }));
        return { success: false, error: 'Autenticação biométrica falhou.' };
      }
    } catch (e: any) {
      console.error("Biometrics authentication failed:", e);
      setState(prev => ({ ...prev, loading: false, error: e.message || 'Autenticação cancelada ou falhou.' }));
      return { success: false, error: e.message || 'Autenticação cancelada ou falhou.' };
    }
  }, [state.isAvailable]);

  return {
    ...state,
    authenticate,
    checkAvailability,
  };
}