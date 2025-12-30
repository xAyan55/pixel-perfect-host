-- Create enum for hosting categories
CREATE TYPE public.hosting_category AS ENUM ('game', 'vps', 'web', 'bot');

-- Create hosting plans table
CREATE TABLE public.hosting_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category hosting_category NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'month',
  ram TEXT NOT NULL,
  cpu TEXT NOT NULL,
  storage TEXT NOT NULL,
  bandwidth TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  redirect_url TEXT NOT NULL,
  popular BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hosting_plans ENABLE ROW LEVEL SECURITY;

-- Public can read enabled plans
CREATE POLICY "Anyone can view enabled plans"
ON public.hosting_plans
FOR SELECT
USING (enabled = true);

-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin policies for hosting_plans (using security definer function)
CREATE POLICY "Admins can view all plans"
ON public.hosting_plans
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert plans"
ON public.hosting_plans
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update plans"
ON public.hosting_plans
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete plans"
ON public.hosting_plans
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for hosting_plans
CREATE TRIGGER update_hosting_plans_updated_at
BEFORE UPDATE ON public.hosting_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans for each category
-- Game Hosting Plans
INSERT INTO public.hosting_plans (category, name, price, billing_cycle, ram, cpu, storage, bandwidth, features, redirect_url, popular, sort_order) VALUES
('game', 'Starter', 4.99, 'month', '2GB', '2 vCores', '20GB SSD', 'Unlimited', ARRAY['DDoS Protection', 'Instant Setup', '24/7 Support', 'Mod Support'], 'https://billing.kinetichost.space/game/starter', false, 1),
('game', 'Pro', 9.99, 'month', '4GB', '4 vCores', '50GB SSD', 'Unlimited', ARRAY['DDoS Protection', 'Instant Setup', '24/7 Priority Support', 'Mod Support', 'Custom Domain'], 'https://billing.kinetichost.space/game/pro', true, 2),
('game', 'Elite', 19.99, 'month', '8GB', '6 vCores', '100GB NVMe', 'Unlimited', ARRAY['Advanced DDoS Protection', 'Instant Setup', '24/7 Priority Support', 'Unlimited Mods', 'Custom Domain', 'Dedicated IP'], 'https://billing.kinetichost.space/game/elite', false, 3),
('game', 'Ultimate', 39.99, 'month', '16GB', '8 vCores', '200GB NVMe', 'Unlimited', ARRAY['Enterprise DDoS Protection', 'Instant Setup', 'Dedicated Support Agent', 'Unlimited Everything', 'Multiple Domains', 'Dedicated IP', 'Daily Backups'], 'https://billing.kinetichost.space/game/ultimate', false, 4);

-- VPS Plans
INSERT INTO public.hosting_plans (category, name, price, billing_cycle, ram, cpu, storage, bandwidth, features, redirect_url, popular, sort_order) VALUES
('vps', 'Basic', 5.99, 'month', '1GB', '1 vCore', '25GB SSD', '1TB', ARRAY['Root Access', 'Choice of OS', '99.9% Uptime', '24/7 Support'], 'https://billing.kinetichost.space/vps/basic', false, 1),
('vps', 'Standard', 12.99, 'month', '2GB', '2 vCores', '50GB SSD', '2TB', ARRAY['Root Access', 'Choice of OS', '99.9% Uptime', '24/7 Support', 'Automated Backups'], 'https://billing.kinetichost.space/vps/standard', true, 2),
('vps', 'Performance', 24.99, 'month', '4GB', '4 vCores', '100GB NVMe', '4TB', ARRAY['Root Access', 'Choice of OS', '99.99% Uptime', 'Priority Support', 'Daily Backups', 'DDoS Protection'], 'https://billing.kinetichost.space/vps/performance', false, 3),
('vps', 'Enterprise', 49.99, 'month', '8GB', '8 vCores', '200GB NVMe', '8TB', ARRAY['Root Access', 'Choice of OS', '99.99% Uptime', 'Dedicated Support', 'Hourly Backups', 'Advanced DDoS', 'Private Networking'], 'https://billing.kinetichost.space/vps/enterprise', false, 4);

-- Web Hosting Plans
INSERT INTO public.hosting_plans (category, name, price, billing_cycle, ram, cpu, storage, bandwidth, features, redirect_url, popular, sort_order) VALUES
('web', 'Starter', 2.99, 'month', '512MB', 'Shared', '5GB SSD', '50GB', ARRAY['1 Website', 'Free SSL', 'Email Accounts', 'One-Click Installs'], 'https://billing.kinetichost.space/web/starter', false, 1),
('web', 'Business', 6.99, 'month', '1GB', 'Shared+', '25GB SSD', 'Unlimited', ARRAY['5 Websites', 'Free SSL', 'Unlimited Email', 'One-Click Installs', 'Daily Backups'], 'https://billing.kinetichost.space/web/business', true, 2),
('web', 'Premium', 12.99, 'month', '2GB', 'Dedicated', '50GB NVMe', 'Unlimited', ARRAY['Unlimited Websites', 'Free SSL', 'Unlimited Email', 'Staging Environment', 'Priority Support', 'Advanced Caching'], 'https://billing.kinetichost.space/web/premium', false, 3),
('web', 'Agency', 24.99, 'month', '4GB', 'Dedicated+', '100GB NVMe', 'Unlimited', ARRAY['Unlimited Everything', 'White-Label', 'Client Management', 'Priority Support', 'Advanced Security', 'CDN Included'], 'https://billing.kinetichost.space/web/agency', false, 4);

-- Bot Hosting Plans
INSERT INTO public.hosting_plans (category, name, price, billing_cycle, ram, cpu, storage, bandwidth, features, redirect_url, popular, sort_order) VALUES
('bot', 'Hobby', 1.99, 'month', '256MB', 'Shared', '2GB SSD', 'Unlimited', ARRAY['1 Bot', 'Node.js/Python', '24/7 Uptime', 'Basic Support'], 'https://billing.kinetichost.space/bot/hobby', false, 1),
('bot', 'Developer', 4.99, 'month', '512MB', '1 vCore', '5GB SSD', 'Unlimited', ARRAY['3 Bots', 'All Languages', '24/7 Uptime', 'Priority Support', 'Custom Domain'], 'https://billing.kinetichost.space/bot/developer', true, 2),
('bot', 'Professional', 9.99, 'month', '1GB', '2 vCores', '10GB SSD', 'Unlimited', ARRAY['10 Bots', 'All Languages', '24/7 Uptime', 'Priority Support', 'Database Included', 'Auto-Restart'], 'https://billing.kinetichost.space/bot/professional', false, 3),
('bot', 'Enterprise', 19.99, 'month', '2GB', '4 vCores', '25GB NVMe', 'Unlimited', ARRAY['Unlimited Bots', 'All Languages', '24/7 Uptime', 'Dedicated Support', 'Multiple Databases', 'Load Balancing', 'API Access'], 'https://billing.kinetichost.space/bot/enterprise', false, 4);