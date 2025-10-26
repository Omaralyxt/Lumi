import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// --- CONFIGURAÇÕES M-PESA (DEVE SER CONFIGURADO COMO SECRETS EM PRODUÇÃO) ---
// Para este ambiente de teste, usaremos os valores fornecidos:
const MPESA_API_KEY = "ujp9zerobl8ddrf84mbc1m5pykx9tkm3";
const MPESA_PUBLIC_KEY = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmptSWqV7cGUUJJhUBxsMLonux24u+FoTlrb+4Kgc6092JIszmI1QUoMohaDDXSVueXx6IXwYGsjjWY32HGXj1iQhkALXfObJ4DqXn5h6E8y5/xQYNAyd5bpN5Z8r892B6toGzZQVB7qtebH4apDjmvTi5FGZVjVYxalyyQkj4uQbbRQjgCkubSi45Xl4CGtLqZztsKssWz3mcKncgTnq3DHGYYEYiKq0xIj100LGbnvNz20Sgqmw/cH+Bua4GJsWYLEqf/h/yiMgiBbxFxsnwZl0im5vXDlwKPw+QnO2fscDhxZFAwV06bgG0oEoWm9FnjMsfvwm0rUNYFlZ+TOtCEhmhtFp+Tsx9jPCuOd5h2emGdSKD8A6jtwhNa7oQ8RtLEEqwAn44orENa1ibOkxMiiiFpmmJkwgZPOG/zMCjXIrrhDWTDUOZaPx/lEQoInJoE2i43VN/HTGCCw8dKQAwg0jsEXau5ixD0GUothqvuX3B9taoeoFAIvUPEq35YulprMM7ThdKodSHvhnwKG82dCsodRwY428kg2xM/UjiTENog4B6zzZfPhMxFlOSFX4MnrqkAS+8Jamhy1GgoHkEMrsT5+/ofjCx0HjKbT5NuA2V/lmzgJLl3jIERadLzuTYnKGWxVJcGLkWXlEPYLbiaKzbJb2sYxt+Kt5OxQqC1MCAwEAAQ==";
const MPESA_SERVICE_PROVIDER_CODE = "171717"; // Shortcode do negócio
const MPESA_URL = "http://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/";
const MPESA_ASYNC_RESPONSE_URL = "https://kxvyveizgrnieetbttjx.supabase.co/functions/v1/mpesa-c2b-webhook"; // URL do webhook

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para simular a geração do token de autorização (em produção, requer criptografia RSA)
function generateAuthorizationToken(apiKey: string, publicKey: string): string {
    // Em um ambiente real, a API Key seria criptografada com a Public Key usando RSA.
    // Aqui, para fins de teste, usaremos um placeholder ou a própria API Key codificada.
    // O exemplo Java sugere que o token é gerado internamente pelo SDK.
    // Vamos simular um token Base64 simples da API Key para passar na requisição.
    // NOTA: Se a API M-Pesa exigir o token criptografado, esta função precisará ser ajustada.
    return btoa(apiKey); 
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { 
      msisdn, 
      amount, 
      transactionReference, 
      thirdPartyReference 
    } = await req.json();

    if (!msisdn || !amount || !transactionReference || !thirdPartyReference) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Gerar Token de Autorização
    const authorizationToken = generateAuthorizationToken(MPESA_API_KEY, MPESA_PUBLIC_KEY);

    // 2. Preparar Payload M-Pesa
    const mpesaPayload = {
      input_TransactionReference: transactionReference,
      input_CustomerMSISDN: msisdn,
      input_Amount: amount.toString(),
      input_ThirdPartyReference: thirdPartyReference,
      input_ServiceProviderCode: MPESA_SERVICE_PROVIDER_CODE,
      // Adicionar Response URL para o fluxo assíncrono
      input_MobileMoneyResponseURL: MPESA_ASYNC_RESPONSE_URL,
    };

    // 3. Fazer a requisição para a API M-Pesa
    const response = await fetch(MPESA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorizationToken}`,
        'Origin': 'developer.mpesa.vm.co.mz', // Usando o Origin de teste fornecido
      },
      body: JSON.stringify(mpesaPayload),
    });

    const mpesaData = await response.json();
    
    if (!response.ok) {
      console.error("M-Pesa API Error:", mpesaData);
      return new Response(JSON.stringify({ 
        error: mpesaData.output_ResponseDesc || 'M-Pesa transaction failed',
        code: mpesaData.output_ResponseCode || response.status,
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Retornar a resposta síncrona (ConversationID)
    return new Response(JSON.stringify({ 
      success: true,
      conversationId: mpesaData.output_ConversationID,
      transactionId: mpesaData.output_TransactionID,
      responseCode: mpesaData.output_ResponseCode,
      responseDesc: mpesaData.output_ResponseDesc,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});