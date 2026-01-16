-- Add game_subtype column to hosting_plans for sub-categorization
ALTER TABLE public.hosting_plans ADD COLUMN IF NOT EXISTS game_subtype text;

-- Add comment for clarity
COMMENT ON COLUMN public.hosting_plans.game_subtype IS 'Sub-category for game types: minecraft (java/bedrock/crossplay), hytale (budget/premium), terraria (budget/premium)';