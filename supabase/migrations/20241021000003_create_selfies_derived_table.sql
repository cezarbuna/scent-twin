-- Migration: Create selfies_derived table
-- Description: Store ONLY derived features from client-side selfie analysis (NO raw images)
-- Privacy: Users can delete this data anytime via soft delete
-- Dependencies: public.users

CREATE TABLE public.selfies_derived (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Seasonal color analysis results (computed client-side)
    -- Examples: 'soft_autumn', 'bright_spring', 'deep_winter', 'light_summer', 
    --           'warm_spring', 'cool_summer', 'true_autumn', 'dark_winter'
    season_subtype TEXT,
    
    -- Skin undertone
    -- Possible values: 'cool', 'neutral', 'warm'
    undertone TEXT,
    
    -- Value level (lightness/darkness)
    -- Possible values: 'light', 'medium', 'deep'
    value_level TEXT,
    
    -- Contrast level (between skin, hair, eyes)
    -- Possible values: 'low', 'medium', 'high'
    contrast_level TEXT,
    
    -- Confidence score from analysis algorithm (0.0 to 1.0)
    confidence_score FLOAT CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    
    -- When analysis was performed
    analysis_date TIMESTAMPTZ DEFAULT NOW(),
    
    -- Soft delete: User can remove this data anytime (privacy-first)
    deleted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.selfies_derived IS 'Client-side derived color analysis features (NO raw images stored)';
COMMENT ON COLUMN public.selfies_derived.deleted_at IS 'Soft delete timestamp - user can remove their selfie data anytime';
COMMENT ON COLUMN public.selfies_derived.confidence_score IS 'Algorithm confidence in analysis results (0.0-1.0)';

-- Create index on user_id for fast lookups
CREATE INDEX idx_selfies_derived_user_id ON public.selfies_derived(user_id);

-- Create index on deleted_at for filtering active records
CREATE INDEX idx_selfies_derived_deleted_at ON public.selfies_derived(deleted_at) WHERE deleted_at IS NULL;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.selfies_derived TO authenticated;
GRANT ALL ON public.selfies_derived TO service_role;

