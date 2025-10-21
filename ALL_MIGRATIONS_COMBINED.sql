-- ============================================================================
-- SCENTTWIN DATABASE SCHEMA - COMPLETE
-- ============================================================================
-- This file combines all 11 migrations into a single script
-- Run this in Supabase SQL Editor: 
-- https://app.supabase.com/project/kzgdpypsofeydsltvlaa/sql/new
-- ============================================================================

-- MIGRATION 1: Create users table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Extended user profile data linked to Supabase auth.users';
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- MIGRATION 2: Create user_profiles table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    primary_goals TEXT[] DEFAULT '{}',
    intended_contexts TEXT[] DEFAULT '{}',
    climate_preferences TEXT[] DEFAULT '{}',
    projection_preference TEXT,
    longevity_expectation TEXT,
    sensitivity_flags TEXT[] DEFAULT '{}',
    budget_band TEXT,
    note_likes TEXT[] DEFAULT '{}',
    note_dislikes TEXT[] DEFAULT '{}',
    brand_preference TEXT,
    scenario_weights JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_profiles IS 'User preferences and quiz responses for personalized recommendations';
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_brand_preference ON public.user_profiles(brand_preference);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

-- MIGRATION 3: Create selfies_derived table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.selfies_derived (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    season_subtype TEXT,
    undertone TEXT,
    value_level TEXT,
    contrast_level TEXT,
    confidence_score FLOAT CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    analysis_date TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.selfies_derived IS 'Client-side derived color analysis features (NO raw images stored)';
CREATE INDEX IF NOT EXISTS idx_selfies_derived_user_id ON public.selfies_derived(user_id);
CREATE INDEX IF NOT EXISTS idx_selfies_derived_deleted_at ON public.selfies_derived(deleted_at) WHERE deleted_at IS NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.selfies_derived TO authenticated;
GRANT ALL ON public.selfies_derived TO service_role;

-- MIGRATION 4: Create perfumes table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.perfumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    brand_type TEXT,
    family TEXT,
    subfamilies TEXT[] DEFAULT '{}',
    top_notes TEXT[] DEFAULT '{}',
    heart_notes TEXT[] DEFAULT '{}',
    base_notes TEXT[] DEFAULT '{}',
    projection TEXT,
    longevity TEXT,
    strength TEXT,
    climate_tags TEXT[] DEFAULT '{}',
    scenario_tags TEXT[] DEFAULT '{}',
    season_tags TEXT[] DEFAULT '{}',
    vibe_descriptors TEXT[] DEFAULT '{}',
    price_band TEXT,
    availability_status TEXT DEFAULT 'available',
    fragrantica_url TEXT,
    official_brand_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.perfumes IS 'Master perfume catalog with detailed metadata for recommendations';
CREATE INDEX IF NOT EXISTS idx_perfumes_brand_type ON public.perfumes(brand_type);
CREATE INDEX IF NOT EXISTS idx_perfumes_family ON public.perfumes(family);
CREATE INDEX IF NOT EXISTS idx_perfumes_price_band ON public.perfumes(price_band);
CREATE INDEX IF NOT EXISTS idx_perfumes_scenario_tags ON public.perfumes USING GIN(scenario_tags);
CREATE INDEX IF NOT EXISTS idx_perfumes_top_notes ON public.perfumes USING GIN(top_notes);
CREATE INDEX IF NOT EXISTS idx_perfumes_heart_notes ON public.perfumes USING GIN(heart_notes);
CREATE INDEX IF NOT EXISTS idx_perfumes_base_notes ON public.perfumes USING GIN(base_notes);
CREATE INDEX IF NOT EXISTS idx_perfumes_climate_tags ON public.perfumes USING GIN(climate_tags);
CREATE INDEX IF NOT EXISTS idx_perfumes_season_tags ON public.perfumes USING GIN(season_tags);
CREATE INDEX IF NOT EXISTS idx_perfumes_brand ON public.perfumes(brand);
CREATE INDEX IF NOT EXISTS idx_perfumes_name ON public.perfumes(name);
CREATE INDEX IF NOT EXISTS idx_perfumes_name_brand_search ON public.perfumes USING GIN(to_tsvector('english', name || ' ' || brand));
GRANT SELECT ON public.perfumes TO authenticated, anon;
GRANT ALL ON public.perfumes TO service_role;

-- MIGRATION 5: Create user_ratings table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    perfume_id UUID REFERENCES public.perfumes(id) ON DELETE CASCADE NOT NULL,
    owns_perfume BOOLEAN DEFAULT false,
    opening_rating INTEGER CHECK (opening_rating BETWEEN 1 AND 5),
    dry_down_rating INTEGER CHECK (dry_down_rating BETWEEN 1 AND 5),
    projection_rating INTEGER CHECK (projection_rating BETWEEN 1 AND 5),
    longevity_rating INTEGER CHECK (longevity_rating BETWEEN 1 AND 5),
    compliments_rating INTEGER CHECK (compliments_rating BETWEEN 1 AND 5),
    scenario_context TEXT,
    overall_rating FLOAT,
    user_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, perfume_id)
);

COMMENT ON TABLE public.user_ratings IS 'User ratings for perfumes (powers collaborative filtering and cohort scoring)';
CREATE INDEX IF NOT EXISTS idx_user_ratings_perfume ON public.user_ratings(perfume_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user ON public.user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_overall ON public.user_ratings(overall_rating);
CREATE INDEX IF NOT EXISTS idx_user_ratings_scenario ON public.user_ratings(scenario_context);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_perfume ON public.user_ratings(user_id, perfume_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_ratings TO authenticated;
GRANT ALL ON public.user_ratings TO service_role;

-- MIGRATION 6: Create wardrobes table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wardrobes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    perfume_id UUID REFERENCES public.perfumes(id) ON DELETE CASCADE NOT NULL,
    context TEXT NOT NULL,
    personal_notes TEXT,
    price_alert_enabled BOOLEAN DEFAULT false,
    price_alert_threshold DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, perfume_id, context)
);

COMMENT ON TABLE public.wardrobes IS 'User collections of saved perfumes organized by usage context';
CREATE INDEX IF NOT EXISTS idx_wardrobes_user_context ON public.wardrobes(user_id, context);
CREATE INDEX IF NOT EXISTS idx_wardrobes_perfume ON public.wardrobes(perfume_id);
CREATE INDEX IF NOT EXISTS idx_wardrobes_price_alerts ON public.wardrobes(perfume_id, price_alert_enabled) WHERE price_alert_enabled = true;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wardrobes TO authenticated;
GRANT ALL ON public.wardrobes TO service_role;

-- MIGRATION 7: Create price_offers table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.price_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfume_id UUID REFERENCES public.perfumes(id) ON DELETE CASCADE NOT NULL,
    retailer_name TEXT NOT NULL,
    retailer_url TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    size_ml INTEGER,
    is_affiliate_link BOOLEAN DEFAULT false,
    affiliate_url TEXT,
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.price_offers IS 'Price tracking across retailers for comparison and price alerts';
CREATE INDEX IF NOT EXISTS idx_price_offers_perfume ON public.price_offers(perfume_id);
CREATE INDEX IF NOT EXISTS idx_price_offers_price ON public.price_offers(price);
CREATE INDEX IF NOT EXISTS idx_price_offers_retailer ON public.price_offers(retailer_name);
CREATE INDEX IF NOT EXISTS idx_price_offers_perfume_price ON public.price_offers(perfume_id, price);
CREATE INDEX IF NOT EXISTS idx_price_offers_last_checked ON public.price_offers(last_checked_at);
GRANT SELECT ON public.price_offers TO authenticated, anon;
GRANT ALL ON public.price_offers TO service_role;

-- MIGRATION 8: Create recommendations_history table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.recommendations_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    perfume_id UUID REFERENCES public.perfumes(id) ON DELETE CASCADE NOT NULL,
    recommendation_type TEXT,
    personal_fit_score FLOAT,
    scenario_fit_score FLOAT,
    cohort_score FLOAT,
    final_score FLOAT,
    revealed_at TIMESTAMPTZ,
    unlock_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.recommendations_history IS 'Track revealed recommendations for free reveal limits and analytics';
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.recommendations_history(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_perfume ON public.recommendations_history(perfume_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_revealed_at ON public.recommendations_history(revealed_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_revealed ON public.recommendations_history(user_id, revealed_at) WHERE unlock_method = 'free_weekly';
CREATE INDEX IF NOT EXISTS idx_recommendations_final_score ON public.recommendations_history(final_score);
GRANT SELECT, INSERT ON public.recommendations_history TO authenticated;
GRANT ALL ON public.recommendations_history TO service_role;

-- MIGRATION 9: Enable RLS and create policies
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selfies_derived ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations_history ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own record" ON public.users;
CREATE POLICY "Users can view own record" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own record" ON public.users;
CREATE POLICY "Users can update own record" ON public.users FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own record" ON public.users;
CREATE POLICY "Users can insert own record" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- User profiles policies
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
CREATE POLICY "Users can manage own profile" ON public.user_profiles FOR ALL USING (auth.uid() = user_id);

-- Selfies derived policies
DROP POLICY IF EXISTS "Users can manage own selfie data" ON public.selfies_derived;
CREATE POLICY "Users can manage own selfie data" ON public.selfies_derived FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Perfumes policies
DROP POLICY IF EXISTS "Anyone can view perfumes" ON public.perfumes;
CREATE POLICY "Anyone can view perfumes" ON public.perfumes FOR SELECT USING (true);

-- User ratings policies
DROP POLICY IF EXISTS "Users can view own ratings" ON public.user_ratings;
CREATE POLICY "Users can view own ratings" ON public.user_ratings FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own ratings" ON public.user_ratings;
CREATE POLICY "Users can insert own ratings" ON public.user_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own ratings" ON public.user_ratings;
CREATE POLICY "Users can update own ratings" ON public.user_ratings FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own ratings" ON public.user_ratings;
CREATE POLICY "Users can delete own ratings" ON public.user_ratings FOR DELETE USING (auth.uid() = user_id);

-- Wardrobes policies
DROP POLICY IF EXISTS "Users can view own wardrobe" ON public.wardrobes;
CREATE POLICY "Users can view own wardrobe" ON public.wardrobes FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can add to own wardrobe" ON public.wardrobes;
CREATE POLICY "Users can add to own wardrobe" ON public.wardrobes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own wardrobe" ON public.wardrobes;
CREATE POLICY "Users can update own wardrobe" ON public.wardrobes FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete from own wardrobe" ON public.wardrobes;
CREATE POLICY "Users can delete from own wardrobe" ON public.wardrobes FOR DELETE USING (auth.uid() = user_id);

-- Price offers policies
DROP POLICY IF EXISTS "Anyone can view price offers" ON public.price_offers;
CREATE POLICY "Anyone can view price offers" ON public.price_offers FOR SELECT USING (true);

-- Recommendations history policies
DROP POLICY IF EXISTS "Users can view own recommendations" ON public.recommendations_history;
CREATE POLICY "Users can view own recommendations" ON public.recommendations_history FOR SELECT USING (auth.uid() = user_id);

-- MIGRATION 10: Create functions and triggers
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_selfies_derived_updated_at ON public.selfies_derived;
CREATE TRIGGER update_selfies_derived_updated_at BEFORE UPDATE ON public.selfies_derived
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_perfumes_updated_at ON public.perfumes;
CREATE TRIGGER update_perfumes_updated_at BEFORE UPDATE ON public.perfumes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_ratings_updated_at ON public.user_ratings;
CREATE TRIGGER update_user_ratings_updated_at BEFORE UPDATE ON public.user_ratings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wardrobes_updated_at ON public.wardrobes;
CREATE TRIGGER update_wardrobes_updated_at BEFORE UPDATE ON public.wardrobes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_price_offers_updated_at ON public.price_offers;
CREATE TRIGGER update_price_offers_updated_at BEFORE UPDATE ON public.price_offers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function: Create user record on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Calculate overall rating
CREATE OR REPLACE FUNCTION public.calculate_overall_rating()
RETURNS TRIGGER AS $$
DECLARE
    rating_sum FLOAT := 0;
    rating_count INTEGER := 0;
BEGIN
    IF NEW.opening_rating IS NOT NULL THEN
        rating_sum := rating_sum + NEW.opening_rating;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.dry_down_rating IS NOT NULL THEN
        rating_sum := rating_sum + NEW.dry_down_rating;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.projection_rating IS NOT NULL THEN
        rating_sum := rating_sum + NEW.projection_rating;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.longevity_rating IS NOT NULL THEN
        rating_sum := rating_sum + NEW.longevity_rating;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.compliments_rating IS NOT NULL THEN
        rating_sum := rating_sum + NEW.compliments_rating;
        rating_count := rating_count + 1;
    END IF;
    IF rating_count > 0 THEN
        NEW.overall_rating := rating_sum / rating_count;
    ELSE
        NEW.overall_rating := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_user_rating_overall ON public.user_ratings;
CREATE TRIGGER calculate_user_rating_overall
    BEFORE INSERT OR UPDATE ON public.user_ratings
    FOR EACH ROW EXECUTE FUNCTION public.calculate_overall_rating();

-- Function: Get weekly free reveals
CREATE OR REPLACE FUNCTION public.get_weekly_free_reveals(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    reveal_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO reveal_count
    FROM public.recommendations_history
    WHERE user_id = user_uuid
        AND unlock_method = 'free_weekly'
        AND revealed_at >= NOW() - INTERVAL '7 days';
    RETURN reveal_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_weekly_free_reveals(UUID) TO authenticated;

-- Function: Check if user has completed quiz
CREATE OR REPLACE FUNCTION public.has_completed_quiz(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_profile BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = user_uuid
            AND primary_goals IS NOT NULL
            AND array_length(primary_goals, 1) > 0
    ) INTO has_profile;
    RETURN has_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.has_completed_quiz(UUID) TO authenticated;

-- MIGRATION 11: Seed sample perfumes (15 perfumes follow on next comment due to length)

