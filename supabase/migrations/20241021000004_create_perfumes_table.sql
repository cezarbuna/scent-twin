-- Migration: Create perfumes table
-- Description: Master perfume catalog with detailed metadata
-- Dependencies: None (independent table)

CREATE TABLE public.perfumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic information
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    
    -- NEW: Brand type for niche vs designer filtering
    -- Possible values: 'niche', 'designer'
    brand_type TEXT,
    
    -- Fragrance classification
    -- Family: 'fresh', 'floral', 'amber', 'woody', 'leather', 'fougere'
    family TEXT,
    
    -- Subfamilies: more specific categories
    -- Examples: ['citrus', 'aromatic'], ['white_floral', 'powdery'], ['oriental', 'spicy']
    subfamilies TEXT[] DEFAULT '{}',
    
    -- Fragrance pyramid (note composition)
    top_notes TEXT[] DEFAULT '{}',
    heart_notes TEXT[] DEFAULT '{}',
    base_notes TEXT[] DEFAULT '{}',
    
    -- Performance characteristics
    -- Projection: 'subtle', 'moderate', 'loud'
    projection TEXT,
    
    -- Longevity: '2-4h', '4-8h', '8+h'
    longevity TEXT,
    
    -- Strength/concentration: 'EDT', 'EDP', 'Parfum', 'Cologne', 'EDP_Intense'
    strength TEXT,
    
    -- Suitability and context tags
    -- Climate: 'warm', 'cold', 'humid', 'dry'
    climate_tags TEXT[] DEFAULT '{}',
    
    -- Scenarios: 'office', 'date', 'sport', 'casual', 'formal', 'night', 'signature'
    scenario_tags TEXT[] DEFAULT '{}',
    
    -- Seasons: 'spring', 'summer', 'fall', 'winter', 'all_season'
    season_tags TEXT[] DEFAULT '{}',
    
    -- Vibe descriptors (personality/mood)
    -- Examples: 'fresh', 'sophisticated', 'bold', 'clean', 'sexy', 'playful', 
    --           'mysterious', 'classic', 'modern', 'masculine', 'feminine', 'unisex'
    vibe_descriptors TEXT[] DEFAULT '{}',
    
    -- Price and availability
    -- Price band: 'affordable', 'mid-range', 'luxury'
    price_band TEXT,
    
    -- Availability: 'available', 'discontinued', 'limited', 'reformulated'
    availability_status TEXT DEFAULT 'available',
    
    -- External research links (for user research, not scraping)
    fragrantica_url TEXT,
    official_brand_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.perfumes IS 'Master perfume catalog with detailed metadata for recommendations';
COMMENT ON COLUMN public.perfumes.brand_type IS 'Niche or designer classification for filtering';
COMMENT ON COLUMN public.perfumes.scenario_tags IS 'Suitable usage contexts for matching user goals';
COMMENT ON COLUMN public.perfumes.vibe_descriptors IS 'Personality and mood descriptors for semantic matching';

-- Create indexes for common query patterns

-- Brand type filtering (NEW)
CREATE INDEX idx_perfumes_brand_type ON public.perfumes(brand_type);

-- Fragrance family filtering
CREATE INDEX idx_perfumes_family ON public.perfumes(family);

-- Price range filtering
CREATE INDEX idx_perfumes_price_band ON public.perfumes(price_band);

-- Scenario matching (GIN index for array containment queries)
CREATE INDEX idx_perfumes_scenario_tags ON public.perfumes USING GIN(scenario_tags);

-- Note searching (GIN indexes for array searches)
CREATE INDEX idx_perfumes_top_notes ON public.perfumes USING GIN(top_notes);
CREATE INDEX idx_perfumes_heart_notes ON public.perfumes USING GIN(heart_notes);
CREATE INDEX idx_perfumes_base_notes ON public.perfumes USING GIN(base_notes);

-- Climate and season filtering
CREATE INDEX idx_perfumes_climate_tags ON public.perfumes USING GIN(climate_tags);
CREATE INDEX idx_perfumes_season_tags ON public.perfumes USING GIN(season_tags);

-- Brand and name search
CREATE INDEX idx_perfumes_brand ON public.perfumes(brand);
CREATE INDEX idx_perfumes_name ON public.perfumes(name);

-- Full-text search index on name and brand
CREATE INDEX idx_perfumes_name_brand_search ON public.perfumes USING GIN(to_tsvector('english', name || ' ' || brand));

-- Grant permissions (public read access)
GRANT SELECT ON public.perfumes TO authenticated, anon;
GRANT ALL ON public.perfumes TO service_role;

