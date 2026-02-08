-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'provisioning', 'active', 'suspended', 'cancelled', 'expired');

-- Create user_servers table to track user's servers
CREATE TABLE public.user_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.hosting_plans(id) ON DELETE RESTRICT,
  pterodactyl_server_id INTEGER,
  pterodactyl_user_id INTEGER,
  panel_username TEXT,
  panel_email TEXT,
  server_name TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_server_id UUID REFERENCES public.user_servers(id) ON DELETE SET NULL,
  plan_id UUID NOT NULL REFERENCES public.hosting_plans(id) ON DELETE RESTRICT,
  order_type TEXT NOT NULL DEFAULT 'new', -- 'new', 'renew', 'upgrade'
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_cycle TEXT NOT NULL DEFAULT 'month',
  paypal_order_id TEXT,
  paypal_capture_id TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plan_pterodactyl_config table for admin to configure specs per plan
CREATE TABLE public.plan_pterodactyl_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.hosting_plans(id) ON DELETE CASCADE UNIQUE,
  node_id INTEGER NOT NULL,
  nest_id INTEGER NOT NULL,
  egg_id INTEGER NOT NULL,
  memory INTEGER NOT NULL, -- in MB
  disk INTEGER NOT NULL, -- in MB
  cpu INTEGER NOT NULL, -- percentage
  databases INTEGER NOT NULL DEFAULT 0,
  backups INTEGER NOT NULL DEFAULT 0,
  allocations INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_pterodactyl_config ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_servers
CREATE POLICY "Users can view their own servers"
ON public.user_servers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all servers"
ON public.user_servers FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert servers"
ON public.user_servers FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update servers"
ON public.user_servers FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete servers"
ON public.user_servers FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for plan_pterodactyl_config
CREATE POLICY "Anyone can view pterodactyl configs"
ON public.plan_pterodactyl_config FOR SELECT
USING (true);

CREATE POLICY "Admins can insert pterodactyl configs"
ON public.plan_pterodactyl_config FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pterodactyl configs"
ON public.plan_pterodactyl_config FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pterodactyl configs"
ON public.plan_pterodactyl_config FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_user_servers_updated_at
BEFORE UPDATE ON public.user_servers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_pterodactyl_config_updated_at
BEFORE UPDATE ON public.plan_pterodactyl_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();