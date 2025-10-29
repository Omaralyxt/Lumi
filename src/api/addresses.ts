import { supabase } from '@/integrations/supabase/client';

export interface CustomerAddress {
  id: string;
  user_id: string;
  name: string;
  full_address: string;
  city: string;
  district: string | null;
  state: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
}

/**
 * Busca todos os endereços de um usuário.
 */
export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_active', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching customer addresses:', error);
    throw new Error('Falha ao buscar endereços.');
  }
  
  return data as CustomerAddress[];
}

/**
 * Insere ou atualiza um endereço.
 */
export async function upsertCustomerAddress(address: Partial<CustomerAddress>): Promise<CustomerAddress> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado.');
  
  const payload = {
    user_id: user.id,
    ...address,
  };

  const { data, error } = await supabase
    .from('customer_addresses')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error upserting address:', error);
    throw new Error(error.message || 'Falha ao salvar endereço.');
  }

  return data as CustomerAddress;
}

/**
 * Define um endereço como ativo e desativa os outros.
 */
export async function setActiveAddress(addressId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado.');

  // 1. Desativar todos os outros endereços do usuário
  const { error: deactivateError } = await supabase
    .from('customer_addresses')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .neq('id', addressId);

  if (deactivateError) {
    console.error('Error deactivating addresses:', deactivateError);
    throw new Error('Falha ao desativar endereços antigos.');
  }

  // 2. Ativar o endereço selecionado
  const { error: activateError } = await supabase
    .from('customer_addresses')
    .update({ is_active: true })
    .eq('id', addressId)
    .eq('user_id', user.id); // RLS já garante isso, mas é bom para segurança extra

  if (activateError) {
    console.error('Error activating address:', activateError);
    throw new Error('Falha ao ativar endereço.');
  }
}

/**
 * Deleta um endereço.
 */
export async function deleteCustomerAddress(addressId: string): Promise<void> {
  const { error } = await supabase
    .from('customer_addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    console.error('Error deleting address:', error);
    throw new Error('Falha ao deletar endereço.');
  }
}