-- Migration: Create recommendations_history table
-- Description: Track revealed recommendations for analytics and free reveal limits
-- Dependencies: public.users, public.perfumes

CREATE TABLE public.recommendations_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    perfume_id UUID REFERENCES public.perfumes(id) ON DELETE CASCADE NOT NULL,
    
    -- Recommendation context
    -- Types: 'blind_reveal', 'monthly_refresh', 'wildcard', 'scenario_specific'
    recommendation_type TEXT,
    
    -- Scoring breakdown (for transparency and debugging)
    -- Personal fit: how well it matches user's note preferences
    personal_fit_score FLOAT,
    
    -- Scenario fit: how well it matches user's intended contexts
    scenario_fit_score FLOAT,
    
    -- Cohort score: how similar users rated this perfume
    cohort_score FLOAT,
    
    -- Final weighted score
    final_score FLOAT,
    
    -- Reveal tracking
    revealed_at TIMESTAMPTZ,
    
    -- How user unlocked this reveal
    -- Methods: 'free_weekly', 'task_completed', 'pro_subscription', 'referral_reward'
    unlock_method TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.recommendations_history IS 'Track revealed recommendations for free reveal limits and analytics';
COMMENT ON COLUMN public.recommendations_history.personal_fit_score IS 'Score based on user note preferences and profile';
COMMENT ON COLUMN public.recommendations_history.scenario_fit_score IS 'Score based on matching usage contexts';
COMMENT ON COLUMN public.recommendations_history.cohort_score IS 'Score from similar users ratings (collaborative filtering)';
COMMENT ON COLUMN public.recommendations_history.unlock_method IS 'How user unlocked this recommendation reveal';

-- Create indexes for analytics and reveal limit enforcement
CREATE INDEX idx_recommendations_user ON public.recommendations_history(user_id);
CREATE INDEX idx_recommendations_perfume ON public.recommendations_history(perfume_id);
CREATE INDEX idx_recommendations_revealed_at ON public.recommendations_history(revealed_at);

-- Index for checking weekly free reveal limits
CREATE INDEX idx_recommendations_user_revealed ON public.recommendations_history(user_id, revealed_at) WHERE unlock_method = 'free_weekly';

-- Index for scoring analysis
CREATE INDEX idx_recommendations_final_score ON public.recommendations_history(final_score);

-- Grant permissions
GRANT SELECT, INSERT ON public.recommendations_history TO authenticated;
GRANT ALL ON public.recommendations_history TO service_role;

