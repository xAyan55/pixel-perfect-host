import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_API_URL = 'https://api-m.paypal.com';

const PTERODACTYL_URL = Deno.env.get('PTERODACTYL_URL')!;
const PTERODACTYL_API_KEY = Deno.env.get('PTERODACTYL_API_KEY')!;

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

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function pterodactylRequest(endpoint: string, method: string, body?: object) {
  const response = await fetch(`${PTERODACTYL_URL}/api/application${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Pterodactyl API error: ${response.status} - ${errorText}`);
    throw new Error(`Pterodactyl API error: ${response.status}`);
  }
  
  if (response.status === 204) return null;
  return response.json();
}

async function getAvailableAllocation(nodeId: number): Promise<number | null> {
  const data = await pterodactylRequest(`/nodes/${nodeId}/allocations?per_page=100`, 'GET');
  const unassigned = data.data.find((a: { attributes: { assigned: boolean } }) => !a.attributes.assigned);
  return unassigned?.attributes?.id || null;
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

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const userId = user.id;
    const { paypalOrderId } = await req.json();

    if (!paypalOrderId) {
      return new Response(JSON.stringify({ error: 'Missing PayPal order ID' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Capture the PayPal payment
    const accessToken = await getPayPalAccessToken();
    
    const captureResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();

    if (!captureResponse.ok || captureData.status !== 'COMPLETED') {
      console.error('PayPal capture error:', captureData);
      return new Response(JSON.stringify({ error: 'Payment capture failed' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const captureId = captureData.purchase_units[0].payments.captures[0].id;

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, hosting_plans(*)')
      .eq('paypal_order_id', paypalOrderId)
      .eq('user_id', userId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderError);
      return new Response(JSON.stringify({ error: 'Order not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Update order status
    await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'paid',
        paypal_capture_id: captureId,
      })
      .eq('id', order.id);

    // Get user's pending server
    const { data: userServer, error: serverError } = await supabaseAdmin
      .from('user_servers')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', order.plan_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (serverError || !userServer) {
      console.error('User server not found:', serverError);
      return new Response(JSON.stringify({ error: 'Server record not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Update server status to provisioning
    await supabaseAdmin
      .from('user_servers')
      .update({ status: 'provisioning' })
      .eq('id', userServer.id);

    // Link order to user_server
    await supabaseAdmin
      .from('orders')
      .update({ user_server_id: userServer.id })
      .eq('id', order.id);

    // Get pterodactyl config for this plan
    const { data: pteroConfig, error: configError } = await supabaseAdmin
      .from('plan_pterodactyl_config')
      .select('*')
      .eq('plan_id', order.plan_id)
      .single();

    if (configError || !pteroConfig) {
      console.error('Pterodactyl config not found:', configError);
      // Update status to show error
      await supabaseAdmin
        .from('user_servers')
        .update({ status: 'pending' })
        .eq('id', userServer.id);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Payment successful but server provisioning pending - no config found',
        userServerId: userServer.id,
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    try {
      // Check if user exists in pterodactyl by email
      const usersData = await pterodactylRequest(`/users?filter[email]=${encodeURIComponent(userServer.panel_email)}`, 'GET');
      
      let pteroUserId: number;
      let panelUsername: string;
      let panelPassword: string | null = null;

      if (usersData.data && usersData.data.length > 0) {
        // User exists
        pteroUserId = usersData.data[0].attributes.id;
        panelUsername = usersData.data[0].attributes.username;
      } else {
        // Create new user
        panelPassword = generatePassword();
        panelUsername = userServer.panel_email.split('@')[0] + Math.floor(Math.random() * 1000);
        
        const newUser = await pterodactylRequest('/users', 'POST', {
          email: userServer.panel_email,
          username: panelUsername,
          first_name: 'Customer',
          last_name: 'User',
          password: panelPassword,
        });
        
        pteroUserId = newUser.attributes.id;
      }

      // Get available allocation
      const allocationId = await getAvailableAllocation(pteroConfig.node_id);
      if (!allocationId) {
        throw new Error('No available allocations');
      }

      // Create server
      const serverData = await pterodactylRequest('/servers', 'POST', {
        name: userServer.server_name,
        user: pteroUserId,
        egg: pteroConfig.egg_id,
        docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
        startup: '{{STARTUP_CMD}}',
        environment: {
          MINECRAFT_VERSION: 'latest',
          BUILD_TYPE: 'recommended',
          STARTUP_CMD: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar',
        },
        limits: {
          memory: pteroConfig.memory,
          swap: 0,
          disk: pteroConfig.disk,
          io: 500,
          cpu: pteroConfig.cpu,
        },
        feature_limits: {
          databases: pteroConfig.databases,
          backups: pteroConfig.backups,
          allocations: pteroConfig.allocations,
        },
        allocation: {
          default: allocationId,
        },
      });

      // Calculate expiry date
      let expiresAt = new Date();
      if (order.billing_cycle === 'month') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else if (order.billing_cycle === 'quarter') {
        expiresAt.setMonth(expiresAt.getMonth() + 3);
      } else if (order.billing_cycle === 'year') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      // Update user_server with pterodactyl info
      await supabaseAdmin
        .from('user_servers')
        .update({
          pterodactyl_server_id: serverData.attributes.id,
          pterodactyl_user_id: pteroUserId,
          panel_username: panelUsername,
          status: 'active',
          expires_at: expiresAt.toISOString(),
        })
        .eq('id', userServer.id);

      // Update order status
      await supabaseAdmin
        .from('orders')
        .update({ status: 'active' })
        .eq('id', order.id);

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Server provisioned successfully',
        userServerId: userServer.id,
        serverId: serverData.attributes.id,
        panelUsername,
        panelPassword, // Only returned for new users
        panelUrl: PTERODACTYL_URL,
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });

    } catch (pteroError) {
      console.error('Pterodactyl provisioning error:', pteroError);
      
      // Update status to show error but payment was successful
      await supabaseAdmin
        .from('user_servers')
        .update({ status: 'pending' })
        .eq('id', userServer.id);

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Payment successful but server provisioning failed. Our team will provision your server shortly.',
        userServerId: userServer.id,
        error: String(pteroError),
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
