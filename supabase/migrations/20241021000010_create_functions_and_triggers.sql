-- Migration: Create database functions and triggers
-- Description: Utility functions for automatic timestamp updates and user onboarding
-- Dependencies: All table migrations

-- ============================================================================
-- FUNCTION: Update updated_at timestamp automatically
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at_column() IS 'Automatically updates updated_at timestamp on row update';

-- ============================================================================
-- TRIGGERS: Apply updated_at trigger to relevant tables
-- ============================================================================

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_selfies_derived_updated_at 
    BEFORE UPDATE ON public.selfies_derived
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_perfumes_updated_at 
    BEFORE UPDATE ON public.perfumes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_ratings_updated_at 
    BEFORE UPDATE ON public.user_ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wardrobes_updated_at 
    BEFORE UPDATE ON public.wardrobes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_price_offers_updated_at 
    BEFORE UPDATE ON public.price_offers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- FUNCTION: Create user record on auth signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a user record when someone signs up via Supabase Auth';

-- Create trigger on auth.users table (Supabase auth schema)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUNCTION: Calculate overall rating from individual ratings
-- ============================================================================

CREATE OR REPLACE FUNCTION public.calculate_overall_rating()
RETURNS TRIGGER AS $$
DECLARE
    rating_sum FLOAT := 0;
    rating_count INTEGER := 0;
BEGIN
    -- Sum up non-null ratings
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
    
    -- Calculate average if we have at least one rating
    IF rating_count > 0 THEN
        NEW.overall_rating := rating_sum / rating_count;
    ELSE
        NEW.overall_rating := NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.calculate_overall_rating() IS 'Automatically calculates overall_rating as average of non-null individual ratings';

-- Apply trigger to user_ratings table
CREATE TRIGGER calculate_user_rating_overall
    BEFORE INSERT OR UPDATE ON public.user_ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_overall_rating();

-- ============================================================================
-- FUNCTION: Get weekly free reveal count for a user
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_weekly_free_reveals(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    reveal_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO reveal_count
    FROM public.recommendations_history
    WHERE user_id = user_uuid
        AND unlock_method = 'free_weekly'
        AND revealed_at >= NOW() - INTERVAL '7 days';
    
    RETURN reveal_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_weekly_free_reveals(UUID) IS 'Returns count of free weekly reveals used in the past 7 days';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_weekly_free_reveals(UUID) TO authenticated;

-- ============================================================================
-- FUNCTION: Check if user has completed quiz
-- ============================================================================

CREATE OR REPLACE FUNCTION public.has_completed_quiz(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_profile BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 
        FROM public.user_profiles 
        WHERE user_id = user_uuid
            AND primary_goals IS NOT NULL
            AND array_length(primary_goals, 1) > 0
    ) INTO has_profile;
    
    RETURN has_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.has_completed_quiz(UUID) IS 'Returns true if user has completed the onboarding quiz';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_completed_quiz(UUID) TO authenticated;

