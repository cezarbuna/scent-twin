-- Migration: Enable Row Level Security and create policies
-- Description: Implement privacy-first RLS policies for all user-data tables
-- Dependencies: All previous table migrations

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selfies_derived ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations_history ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own record
CREATE POLICY "Users can view own record" 
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own record
CREATE POLICY "Users can update own record" 
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own record (for new signups)
CREATE POLICY "Users can insert own record" 
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- USER PROFILES TABLE POLICIES
-- ============================================================================

-- Users have full CRUD access to their own profile
CREATE POLICY "Users can manage own profile" 
ON public.user_profiles
FOR ALL
USING (auth.uid() = user_id);

-- ============================================================================
-- SELFIES DERIVED TABLE POLICIES
-- ============================================================================

-- Users have full CRUD access to their own selfie data
-- Only show non-deleted records
CREATE POLICY "Users can manage own selfie data" 
ON public.selfies_derived
FOR ALL
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- ============================================================================
-- PERFUMES TABLE POLICIES
-- ============================================================================

-- Anyone (authenticated or anonymous) can view perfumes (public catalog)
CREATE POLICY "Anyone can view perfumes" 
ON public.perfumes
FOR SELECT
USING (true);

-- Only service role can insert/update/delete perfumes (admin operations)
-- This is handled automatically via GRANT permissions

-- ============================================================================
-- USER RATINGS TABLE POLICIES
-- ============================================================================

-- Users can view their own ratings
CREATE POLICY "Users can view own ratings" 
ON public.user_ratings
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own ratings
CREATE POLICY "Users can insert own ratings" 
ON public.user_ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings" 
ON public.user_ratings
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings" 
ON public.user_ratings
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- WARDROBES TABLE POLICIES
-- ============================================================================

-- Users can view their own wardrobe
CREATE POLICY "Users can view own wardrobe" 
ON public.wardrobes
FOR SELECT
USING (auth.uid() = user_id);

-- Users can add to their own wardrobe
CREATE POLICY "Users can add to own wardrobe" 
ON public.wardrobes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own wardrobe entries
CREATE POLICY "Users can update own wardrobe" 
ON public.wardrobes
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete from their own wardrobe
CREATE POLICY "Users can delete from own wardrobe" 
ON public.wardrobes
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- PRICE OFFERS TABLE POLICIES
-- ============================================================================

-- Anyone can view price offers (public price transparency)
CREATE POLICY "Anyone can view price offers" 
ON public.price_offers
FOR SELECT
USING (true);

-- Only service role can manage prices (automated scraping/updates)
-- This is handled automatically via GRANT permissions

-- ============================================================================
-- RECOMMENDATIONS HISTORY TABLE POLICIES
-- ============================================================================

-- Users can view their own recommendations history
CREATE POLICY "Users can view own recommendations" 
ON public.recommendations_history
FOR SELECT
USING (auth.uid() = user_id);

-- Only service role can insert recommendations (generated by backend)
-- This is handled automatically via GRANT permissions

-- ============================================================================
-- ADDITIONAL SECURITY
-- ============================================================================

-- Revoke public schema access from anon and authenticated roles
-- They can only access through RLS policies
REVOKE ALL ON SCHEMA public FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Ensure public can access tables only through RLS
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT SELECT ON public.perfumes TO anon, authenticated;
GRANT SELECT ON public.price_offers TO anon, authenticated;

-- Authenticated users get appropriate access (enforced by RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.selfies_derived TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_ratings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wardrobes TO authenticated;
GRANT SELECT ON public.recommendations_history TO authenticated;

