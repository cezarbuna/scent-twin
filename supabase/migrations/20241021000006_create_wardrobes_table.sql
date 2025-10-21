-- Migration: Create wardrobes table
-- Description: User's saved perfume collections organized by context
-- Dependencies: public.users, public.perfumes

CREATE TABLE public.wardrobes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    perfume_id UUID REFERENCES public.perfumes(id) ON DELETE CASCADE NOT NULL,
    
    -- Context/collection organization
    -- Values: 'work', 'date', 'gym', 'night', 'signature', 'wishlist', 'owned'
    context TEXT NOT NULL,
    
    -- Personal notes about this perfume in this context
    personal_notes TEXT,
    
    -- Price alert settings
    price_alert_enabled BOOLEAN DEFAULT false,
    price_alert_threshold DECIMAL(10, 2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Allow same perfume in multiple contexts, but not duplicates within a context
    UNIQUE(user_id, perfume_id, context)
);

-- Add comments for documentation
COMMENT ON TABLE public.wardrobes IS 'User collections of saved perfumes organized by usage context';
COMMENT ON COLUMN public.wardrobes.context IS 'Usage context or collection type (work, date, wishlist, etc.)';
COMMENT ON COLUMN public.wardrobes.price_alert_enabled IS 'Enable price drop notifications for this perfume';

-- Create indexes for common queries
CREATE INDEX idx_wardrobes_user_context ON public.wardrobes(user_id, context);
CREATE INDEX idx_wardrobes_perfume ON public.wardrobes(perfume_id);
CREATE INDEX idx_wardrobes_price_alerts ON public.wardrobes(perfume_id, price_alert_enabled) WHERE price_alert_enabled = true;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wardrobes TO authenticated;
GRANT ALL ON public.wardrobes TO service_role;

