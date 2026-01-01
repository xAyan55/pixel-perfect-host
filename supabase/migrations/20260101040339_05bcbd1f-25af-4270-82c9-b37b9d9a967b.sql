-- Create features table for editable features in the features section
CREATE TABLE public.features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'settings',
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view enabled features" 
ON public.features 
FOR SELECT 
USING (enabled = true);

CREATE POLICY "Admins can view all features" 
ON public.features 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert features" 
ON public.features 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update features" 
ON public.features 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete features" 
ON public.features 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_features_updated_at
BEFORE UPDATE ON public.features
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default features
INSERT INTO public.features (title, description, icon, sort_order) VALUES
('Plugins', 'Over 15,000 plugins to run your Minecraft server.', 'puzzle', 1),
('Automations', 'Setup automations for backups and other server features.', 'settings', 2),
('Knowledgebase', 'Learn from 300+ articles written by Minecraft professionals.', 'book', 3),
('Modpacks', '10,000+ modpacks from Modrinth & Curseforge.', 'package', 4),
('Backups', 'Automated server backups to keep your world safe.', 'save', 5),
('Instances', 'Save your progress and switch between multiple server setups.', 'layers', 6),
('Version Changer', 'Switch between server versions and types any time.', 'refresh-cw', 7),
('Minecraft Tools', 'Use built-in quality-of-life features like MOTD Editor and more.', 'wrench', 8);