-- Temporary fix: Disable RLS to test if that's the issue
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Test query to see if we can now read the profile
SELECT * FROM public.user_profiles WHERE user_id = '646ca693-4520-4f43-80e9-c0fb22435b02';
