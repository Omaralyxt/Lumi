import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Inicializa o cliente Supabase Service Role (para acesso irrestrito ao banco de dados)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const data = await req.json();
    console.log('Webhook received data:', data);

    // Parâmetros importantes do M-Pesa Async Result Request
    const thirdPartyReference = data.input_ThirdPartyReference;
    const transactionId = data.input_TransactionID;
    const resultCode = data.input_ResultCode;
    const resultDesc = data.input_ResultDesc;

    if (!thirdPartyReference || !transactionId) {
      console.error("Missing required fields in webhook payload.");
      return new Response(JSON.stringify({ 
        output_ResponseCode: "400", 
        output_ResponseDesc: "Missing Reference",
        output_OriginalConversationID: data.input_OriginalConversationID,
        output_ThirdPartyConversationID: thirdPartyReference,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determinar o status do pagamento
    let paymentStatus = 'failed';
    let orderStatus = 'cancelled';
    
    if (resultCode === '0') {
      paymentStatus = 'paid';
      orderStatus = 'confirmed'; // Se pago, o pedido é confirmado
    }

    // 1. Atualizar o status do pedido no banco de dados usando thirdPartyReference (que deve ser o order_number)
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        payment_status: paymentStatus,
        status: orderStatus,
        mpesa_transaction_id: transactionId, // Adicionar campo para ID da transação M-Pesa
        updated_at: new Date().toISOString(),
      })
      .eq('order_number', thirdPartyReference)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating order status:", updateError);
      // Responder com sucesso para evitar reenvio do webhook, mas logar o erro
    } else if (updatedOrder) {
      console.log(`Order ${updatedOrder.order_number} updated to status: ${orderStatus}`);
      
      // Opcional: Criar notificação para o vendedor sobre o pagamento bem-sucedido
      if (paymentStatus === 'paid') {
        await supabaseAdmin.from('notifications').insert({
          store_id: updatedOrder.store_id,
          order_id: updatedOrder.id,
          type: 'payment_success',
          title: 'Pagamento Recebido',
          message: `O pagamento para o pedido #${updatedOrder.order_number} foi confirmado.`,
        });
      }
    }

    // 2. Responder ao M-Pesa conforme a documentação
    return new Response(JSON.stringify({ 
      output_ResponseCode: "0", 
      output_ResponseDesc: "Successfully Accepted Result",
      output_OriginalConversationID: data.input_OriginalConversationID,
      output_ThirdPartyConversationID: thirdPartyReference,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      output_ResponseCode: "500", 
      output_ResponseDesc: "Internal Server Error",
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});