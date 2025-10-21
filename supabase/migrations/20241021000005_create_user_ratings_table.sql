-- Migration: Create user_ratings table
-- Description: Store detailed user ratings for perfumes (powers cohort scoring)
-- Dependencies: public.users, public.perfumes

CREATE TABLE public.user_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    perfume_id UUID REFERENCES public.perfumes(id) ON DELETE CASCADE NOT NULL,
    
    -- Ownership status
    owns_perfume BOOLEAN DEFAULT false,
    
    -- Detailed multi-dimensional ratings (1-5 scale, nullable if not rated)
    -- Rating the opening/first spray
    opening_rating INTEGER CHECK (opening_rating BETWEEN 1 AND 5),
    
    -- Rating the dry-down/final stage
    dry_down_rating INTEGER CHECK (dry_down_rating BETWEEN 1 AND 5),
    
    -- How strong/noticeable is it
    projection_rating INTEGER CHECK (projection_rating BETWEEN 1 AND 5),
    
    -- How long does it last
    longevity_rating INTEGER CHECK (longevity_rating BETWEEN 1 AND 5),
    
    -- Social reception/compliments received
    compliments_rating INTEGER CHECK (compliments_rating BETWEEN 1 AND 5),
    
    -- Scenario context when wearing/rating
    -- Values: 'work', 'date', 'gym', 'casual', 'formal', 'night', 'signature'
    scenario_context TEXT,
    
    -- Overall rating (computed average of non-null ratings)
    overall_rating FLOAT,
    
    -- Quick user notes
    user_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate ratings (one rating per user per perfume)
    UNIQUE(user_id, perfume_id)
);

-- Add comments for documentation
COMMENT ON TABLE public.user_ratings IS 'User ratings for perfumes (powers collaborative filtering and cohort scoring)';
COMMENT ON COLUMN public.user_ratings.opening_rating IS 'Rating of the opening/top notes (1-5)';
COMMENT ON COLUMN public.user_ratings.dry_down_rating IS 'Rating of the dry-down/base notes (1-5)';
COMMENT ON COLUMN public.user_ratings.overall_rating IS 'Computed average of all non-null ratings';

-- Create indexes for cohort algorithm and queries
CREATE INDEX idx_user_ratings_perfume ON public.user_ratings(perfume_id);
CREATE INDEX idx_user_ratings_user ON public.user_ratings(user_id);
CREATE INDEX idx_user_ratings_overall ON public.user_ratings(overall_rating);
CREATE INDEX idx_user_ratings_scenario ON public.user_ratings(scenario_context);

-- Composite index for finding similar users (user similarity matching)
CREATE INDEX idx_user_ratings_user_perfume ON public.user_ratings(user_id, perfume_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_ratings TO authenticated;
GRANT ALL ON public.user_ratings TO service_role;

