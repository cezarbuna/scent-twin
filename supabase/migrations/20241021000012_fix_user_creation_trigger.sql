-- Migration: Fix user creation trigger to also create user_profiles
-- Description: Enhance the handle_new_user trigger to automatically create both users and user_profiles records
-- Dependencies: 20241021000010_create_functions_and_triggers.sql

-- ============================================================================
-- FUNCTION: Create user and profile records on auth signup
-- ============================================================================

-- Drop the old function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create enhanced function that creates both users and user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user record in public.users
    INSERT INTO public.users (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW());
    
    -- Create user profile record
    INSERT INTO public.user_profiles (user_id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user and user_profile records when someone signs up via Supabase Auth';

-- Recreate trigger on auth.users table
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

