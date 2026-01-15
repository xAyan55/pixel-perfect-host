-- Add game_type column to hosting_plans for filtering game-specific plans
ALTER TABLE public.hosting_plans 
ADD COLUMN game_type TEXT DEFAULT NULL;

-- Create index for faster game_type queries
CREATE INDEX idx_hosting_plans_game_type ON public.hosting_plans(game_type);

-- Add comment for documentation
COMMENT ON COLUMN public.hosting_plans.game_type IS 'Specific game type for game hosting plans (e.g., minecraft, hytale, terraria)';