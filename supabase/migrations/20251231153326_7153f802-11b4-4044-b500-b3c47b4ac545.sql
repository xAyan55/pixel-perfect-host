-- Create FAQs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Policies for FAQs
CREATE POLICY "Anyone can view enabled FAQs" ON public.faqs FOR SELECT USING (enabled = true);
CREATE POLICY "Admins can view all FAQs" ON public.faqs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert FAQs" ON public.faqs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update FAQs" ON public.faqs FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete FAQs" ON public.faqs FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create social links table
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on social links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Policies for social links
CREATE POLICY "Anyone can view enabled social links" ON public.social_links FOR SELECT USING (enabled = true);
CREATE POLICY "Admins can view all social links" ON public.social_links FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert social links" ON public.social_links FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update social links" ON public.social_links FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete social links" ON public.social_links FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default FAQs
INSERT INTO public.faqs (question, answer, sort_order) VALUES
('What makes KineticHost different?', 'We focus on pure performance with enterprise-grade hardware, DDoS protection, and 24/7 expert support at competitive prices.', 1),
('What payment methods do you accept?', 'We accept all major credit cards, PayPal, and cryptocurrency payments for your convenience.', 2),
('Do you offer a money-back guarantee?', 'Yes! We offer a 7-day money-back guarantee on all hosting plans. No questions asked.', 3),
('How fast is your support response time?', 'Our average response time is under 15 minutes. We pride ourselves on fast, knowledgeable support.', 4);

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon, sort_order) VALUES
('Discord', 'https://discord.gg/kinetichost', 'discord', 1),
('Twitter', 'https://twitter.com/kinetichost', 'twitter', 2),
('GitHub', 'https://github.com/kinetichost', 'github', 3);