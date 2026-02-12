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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const userId = user.id;
    const userEmail = user.email || '';

    const { planId, serverName, billingCycle = 'month', orderType = 'new', userServerId, couponCode } = await req.json();

    if (!planId || !serverName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get plan details
    const { data: plan, error: planError } = await supabaseAdmin
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
    let cycleDiscount = 0;
    if (billingCycle === 'quarter') {
      multiplier = 3;
      cycleDiscount = 0.10;
    } else if (billingCycle === 'year') {
      multiplier = 12;
      cycleDiscount = 0.20;
    }
    
    const baseAmount = Number(plan.price) * multiplier;
    let subtotal = baseAmount * (1 - cycleDiscount);

    // Validate and apply coupon
    let couponDiscount = 0;
    let validCouponCode: string | null = null;

    if (couponCode) {
      const { data: coupon, error: couponError } = await supabaseAdmin
        .from('discount_coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('enabled', true)
        .maybeSingle();

      if (coupon && !couponError) {
        const now = new Date();
        const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > now;
        const notMaxed = !coupon.max_uses || coupon.current_uses < coupon.max_uses;
        const meetsMin = subtotal >= Number(coupon.min_order_amount || 0);

        if (notExpired && notMaxed && meetsMin) {
          if (coupon.discount_type === 'percentage') {
            couponDiscount = subtotal * (Number(coupon.discount_value) / 100);
          } else {
            couponDiscount = Math.min(Number(coupon.discount_value), subtotal);
          }
          validCouponCode = coupon.code;

          // Increment usage
          await supabaseAdmin
            .from('discount_coupons')
            .update({ current_uses: coupon.current_uses + 1 })
            .eq('id', coupon.id);
        }
      }
    }

    const finalAmount = Math.max(0, subtotal - couponDiscount).toFixed(2);

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
        coupon_code: validCouponCode,
        discount_amount: couponDiscount,
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
