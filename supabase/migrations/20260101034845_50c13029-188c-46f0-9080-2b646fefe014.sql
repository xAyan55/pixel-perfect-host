-- Add featured banner settings
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES 
  ('featured_banner_title', 'UPDATE AVAILABLE'),
  ('featured_banner_subtitle', 'Featured Server'),
  ('featured_banner_image_url', '')
ON CONFLICT (setting_key) DO NOTHING;