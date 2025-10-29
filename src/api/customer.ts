import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  alternative_phone?: string;
  shipping_address: string; // Rua ou Casa
  city: string;
  district: string; // Bairro
  state: string; // Província
  zip_code: string;
  created_at: string;
}

/**
 * Busca o perfil detalhado do cliente.
 * Se não existir, retorna null.
 */
export async function getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
    console.error('Error fetching customer profile:', error);
    throw new Error('Falha ao buscar perfil do cliente.');
  }
  
  return data as CustomerProfile | null;
}

/**
 * Insere ou atualiza o perfil do cliente.
 */
export async function upsertCustomerProfile(profile: Partial<CustomerProfile>): Promise<CustomerProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado.');
  
  // Usamos o user_id como chave de conflito para garantir que cada usuário tenha apenas um registro
  const payload = {
    user_id: user.id,
    ...profile,
    // Garantir que o email e nome sejam preenchidos se for a primeira inserção
    full_name: profile.full_name || user.user_metadata.full_name || '',
    email: profile.email || user.email || '',
  };

  const { data, error } = await supabase
    .from('customers')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting customer profile:', error);
    throw new Error(error.message || 'Falha ao salvar perfil.');
  }

  return data as CustomerProfile;
}