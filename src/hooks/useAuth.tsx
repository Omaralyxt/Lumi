"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      setAuthState({
        user,
        isAuthenticated: !!user,
        loading: false,
      });
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user || null,
        isAuthenticated: !!session?.user,
        loading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
}