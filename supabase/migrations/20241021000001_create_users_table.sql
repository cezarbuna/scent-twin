-- Migration: Create users table
-- Description: Extends auth.users with additional profile data
-- Dependencies: Supabase auth.users (built-in)

-- Create users table that extends auth.users
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE public.users IS 'Extended user profile data linked to Supabase auth.users';

-- Create index on email for lookups
CREATE INDEX idx_users_email ON public.users(email);

-- Grant permissions (RLS policies will be added in a later migration)
-- Service role can manage all users, authenticated users can read their own record
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

