-- Migration: Fix RLS policies for user_profiles and users tables

-- First, let's check and disable RLS temporarily to see if that's the issue
-- Then we'll re-enable it with proper policies

-- Disable RLS temporarily to test
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own user record" ON public.users;
DROP POLICY IF EXISTS "Users can update own user record" ON public.users;
DROP POLICY IF EXISTS "Users can insert own user record" ON public.users;

-- Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create comprehensive RLS policies for users
CREATE POLICY "Users can view own user record" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own user record" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own user record" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Also create a policy that allows the trigger to insert records
-- This is needed because the trigger runs as the system, not as the user
CREATE POLICY "System can insert user profiles" ON public.user_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;

-- Grant permissions to the service role (for triggers)
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.users TO service_role;
