-- Migration: Create user_profiles table
-- Description: Store user preferences, quiz responses, and scenario weights
-- Dependencies: public.users

CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Goals & Scenarios (array of selected contexts)
    -- Possible values: 'work', 'date_night', 'gym', 'casual', 'signature', 'gifting'
    primary_goals TEXT[] DEFAULT '{}',
    
    -- Quiz responses: Intended usage contexts
    -- Possible values: 'office', 'dates', 'nights_out', 'sport', 'formal', 'casual_daily'
    intended_contexts TEXT[] DEFAULT '{}',
    
    -- Climate preferences
    -- Possible values: 'warm', 'cold', 'humid', 'dry'
    climate_preferences TEXT[] DEFAULT '{}',
    
    -- Projection preference (how strong/noticeable)
    -- Possible values: 'subtle', 'moderate', 'loud'
    projection_preference TEXT,
    
    -- Longevity expectation
    -- Possible values: '2-4h', '4-8h', '8+h'
    longevity_expectation TEXT,
    
    -- Sensitivity flags (triggers/sensitivities)
    -- Examples: 'strong_florals', 'synthetic_musks', 'aldehydes', 'animalic_notes'
    sensitivity_flags TEXT[] DEFAULT '{}',
    
    -- Budget band
    -- Possible values: 'affordable', 'mid-range', 'luxury'
    budget_band TEXT,
    
    -- Note preferences (likes/dislikes)
    -- Possible values: 'citrus', 'florals', 'woods', 'musk', 'amber', 'vanilla', 
    --                  'incense', 'green', 'aquatic', 'fruity', 'spice', 'gourmand'
    note_likes TEXT[] DEFAULT '{}',
    note_dislikes TEXT[] DEFAULT '{}',
    
    -- NEW: Niche vs Designer preference
    -- Possible values: 'niche', 'designer', 'no_preference'
    brand_preference TEXT,
    
    -- Scenario weights (computed from goals and intended contexts)
    -- JSON object like: {"work": 0.8, "date": 0.6, "gym": 0.3, "casual": 0.5}
    scenario_weights JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.user_profiles IS 'User preferences and quiz responses for personalized recommendations';
COMMENT ON COLUMN public.user_profiles.scenario_weights IS 'Computed weights for different usage scenarios based on user goals';
COMMENT ON COLUMN public.user_profiles.brand_preference IS 'User preference for niche vs designer fragrances';

-- Create index on user_id for fast lookups
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Create index on brand_preference for filtering
CREATE INDEX idx_user_profiles_brand_preference ON public.user_profiles(brand_preference);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

