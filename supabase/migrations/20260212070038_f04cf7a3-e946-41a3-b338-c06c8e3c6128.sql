
-- Create discount coupons table
CREATE TABLE public.discount_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER NOT NULL DEFAULT 0,
  min_order_amount NUMERIC DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;

-- Anyone can read enabled coupons (needed for validation)
CREATE POLICY "Anyone can view enabled coupons"
ON public.discount_coupons
FOR SELECT
USING (enabled = true);

-- Admins full access
CREATE POLICY "Admins can manage coupons"
ON public.discount_coupons
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_discount_coupons_updated_at
BEFORE UPDATE ON public.discount_coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add coupon_code column to orders table
ALTER TABLE public.orders ADD COLUMN coupon_code TEXT DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN discount_amount NUMERIC DEFAULT 0;
