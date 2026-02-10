import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_API_URL = 'https://api-m.paypal.com';

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID')!;
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')!;
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });
  
  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const userId = user.id;
    const userEmail = user.email || '';

    const { planId, serverName, billingCycle = 'month', orderType = 'new', userServerId } = await req.json();

    if (!planId || !serverName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('hosting_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: 'Plan not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Calculate price based on billing cycle
    let multiplier = 1;
    let discount = 0;
    if (billingCycle === 'quarter') {
      multiplier = 3;
      discount = 0.10; // 10% discount
    } else if (billingCycle === 'year') {
      multiplier = 12;
      discount = 0.20; // 20% discount
    }
    
    const baseAmount = Number(plan.price) * multiplier;
    const finalAmount = (baseAmount * (1 - discount)).toFixed(2);

    // Create PayPal order
    const accessToken = await getPayPalAccessToken();
    
    const paypalResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: finalAmount,
          },
          description: `${plan.name} - ${billingCycle === 'month' ? 'Monthly' : billingCycle === 'quarter' ? 'Quarterly' : 'Annual'} Subscription`,
        }],
        application_context: {
          brand_name: 'KineticHost',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${req.headers.get('origin')}/client`,
          cancel_url: `${req.headers.get('origin')}/checkout`,
        },
      }),
    });

    const paypalOrder = await paypalResponse.json();

    if (!paypalResponse.ok) {
      console.error('PayPal error:', paypalOrder);
      return new Response(JSON.stringify({ error: 'Failed to create PayPal order' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Create order in database using service role for insert
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        plan_id: planId,
        order_type: orderType,
        amount: finalAmount,
        billing_cycle: billingCycle,
        paypal_order_id: paypalOrder.id,
        status: 'pending',
        user_server_id: userServerId || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(JSON.stringify({ error: 'Failed to create order' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Store server name and user info in metadata for provisioning later
    await supabaseAdmin
      .from('orders')
      .update({ 
        // We'll use a simple approach - store metadata in a way that's accessible
      })
      .eq('id', order.id);

    // For new orders, create a pending user_server entry
    if (orderType === 'new') {
      await supabaseAdmin
        .from('user_servers')
        .insert({
          user_id: userId,
          plan_id: planId,
          server_name: serverName,
          panel_email: userEmail,
          status: 'pending',
        });
    }

    const approveUrl = paypalOrder.links.find((link: { rel: string }) => link.rel === 'approve')?.href;

    return new Response(JSON.stringify({ 
      orderId: paypalOrder.id,
      approveUrl,
      dbOrderId: order.id,
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
