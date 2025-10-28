"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface NotificationState {
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export function useNotifications(): NotificationState {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [state, setState] = useState<NotificationState>({
    unreadCount: 0,
    loading: true,
    error: null,
  });

  const fetchUnreadCount = async (userId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 1. Encontrar o store_id do usuário (se ele for um vendedor)
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('seller_id', userId)
        .single();

      if (storeError && storeError.code !== 'PGRST116') { // PGRST116 = No rows found
        // Se houver um erro real (não apenas "não encontrado"), logamos
        console.error("Error fetching store ID for notifications:", storeError);
      }
      
      const storeId = storeData?.id;
      
      if (!storeId) {
        // Se não for vendedor ou não tiver loja, não há notificações de loja para contar
        setState({ unreadCount: 0, loading: false, error: null });
        return;
      }

      // 2. Contar notificações não lidas para a loja
      const { count, error: countError } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('is_read', false);

      if (countError) {
        throw countError;
      }

      setState({
        unreadCount: count || 0,
        loading: false,
        error: null,
      });

    } catch (err: any) {
      setState({
        unreadCount: 0,
        loading: false,
        error: err.message || 'Failed to fetch notifications',
      });
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && user) {
        fetchUnreadCount(user.id);
        
        // Opcional: Configurar Realtime Subscription para atualizações instantâneas
        const channel = supabase
          .channel('notifications_channel')
          .on(
            'postgres_changes',
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'notifications',
              filter: `store_id=eq.${user.id}` // Filtro simplificado, idealmente usaria RLS
            },
            (payload) => {
              // Se uma nova notificação for inserida, atualiza a contagem
              fetchUnreadCount(user.id);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } else {
        setState({ unreadCount: 0, loading: false, error: null });
      }
    }
  }, [isAuthenticated, authLoading, user?.id]);

  return state;
}