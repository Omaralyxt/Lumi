import { supabase } from '@/integrations/supabase/client';

interface MpesaPaymentData {
  msisdn: string;
  amount: number;
  orderNumber: string;
}

interface MpesaResponse {
  success: boolean;
  conversationId?: string;
  transactionId?: string;
  responseCode?: string;
  responseDesc?: string;
  error?: string;
}

// URL da Edge Function para iniciar o pagamento
const MPESA_INIT_FUNCTION_URL = 'mpesa-c2b-init';

export async function initiateMpesaPayment({ msisdn, amount, orderNumber }: MpesaPaymentData): Promise<MpesaResponse> {
  try {
    // O ThirdPartyReference será o OrderNumber para rastreamento
    const response = await supabase.functions.invoke(MPESA_INIT_FUNCTION_URL, {
      body: {
        msisdn: msisdn,
        amount: amount,
        transactionReference: orderNumber, // Referência da transação
        thirdPartyReference: orderNumber, // Referência do terceiro (usamos o order number)
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    
    const data = response.data as MpesaResponse;

    if (!data.success) {
      return { success: false, error: data.error || data.responseDesc || 'Falha ao iniciar M-Pesa' };
    }

    return data;

  } catch (error) {
    console.error("Error initiating M-Pesa payment:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido ao processar M-Pesa.' };
  }
}