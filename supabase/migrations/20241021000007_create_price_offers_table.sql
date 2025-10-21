-- Migration: Create price_offers table
-- Description: Track perfume prices across retailers for price comparison and alerts
-- Dependencies: public.perfumes

CREATE TABLE public.price_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfume_id UUID REFERENCES public.perfumes(id) ON DELETE CASCADE NOT NULL,
    
    -- Retailer information
    retailer_name TEXT NOT NULL,
    retailer_url TEXT NOT NULL,
    
    -- Price details
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    size_ml INTEGER, -- Bottle size in milliliters
    
    -- Affiliate tracking (ethical monetization)
    is_affiliate_link BOOLEAN DEFAULT false,
    affiliate_url TEXT,
    
    -- Data freshness
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.price_offers IS 'Price tracking across retailers for comparison and price alerts';
COMMENT ON COLUMN public.price_offers.is_affiliate_link IS 'Whether this retailer link includes affiliate tracking';
COMMENT ON COLUMN public.price_offers.last_checked_at IS 'Last time this price was verified/scraped';

-- Create indexes for price comparison queries
CREATE INDEX idx_price_offers_perfume ON public.price_offers(perfume_id);
CREATE INDEX idx_price_offers_price ON public.price_offers(price);
CREATE INDEX idx_price_offers_retailer ON public.price_offers(retailer_name);

-- Index for finding cheapest offers
CREATE INDEX idx_price_offers_perfume_price ON public.price_offers(perfume_id, price);

-- Index for freshness checks
CREATE INDEX idx_price_offers_last_checked ON public.price_offers(last_checked_at);

-- Grant permissions (public read access for price transparency)
GRANT SELECT ON public.price_offers TO authenticated, anon;
GRANT ALL ON public.price_offers TO service_role;

