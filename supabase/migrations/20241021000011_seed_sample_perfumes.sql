-- Migration: Seed sample perfumes
-- Description: Insert diverse sample perfumes for testing and development
-- Dependencies: public.perfumes table

-- ============================================================================
-- DESIGNER FRAGRANCES
-- ============================================================================

INSERT INTO public.perfumes (
    name, brand, brand_type, family, subfamilies,
    top_notes, heart_notes, base_notes,
    projection, longevity, strength,
    climate_tags, scenario_tags, season_tags, vibe_descriptors,
    price_band, fragrantica_url
) VALUES

-- 1. Bleu de Chanel EDP (Designer, Woody Aromatic)
(
    'Bleu de Chanel Eau de Parfum',
    'Chanel',
    'designer',
    'woody',
    ARRAY['aromatic'],
    ARRAY['lemon', 'mint', 'pink pepper', 'grapefruit'],
    ARRAY['ginger', 'nutmeg', 'jasmine', 'melon'],
    ARRAY['cedar', 'sandalwood', 'amber', 'labdanum'],
    'moderate',
    '4-8h',
    'EDP',
    ARRAY['warm', 'cold'],
    ARRAY['office', 'date', 'casual', 'formal'],
    ARRAY['spring', 'summer', 'fall', 'winter'],
    ARRAY['fresh', 'sophisticated', 'clean', 'versatile', 'masculine'],
    'luxury',
    'https://www.fragrantica.com/perfume/Chanel/Bleu-de-Chanel-Eau-de-Parfum-25967.html'
),

-- 2. Dior Sauvage EDP (Designer, Fresh Aromatic)
(
    'Sauvage Eau de Parfum',
    'Dior',
    'designer',
    'fresh',
    ARRAY['aromatic', 'spicy'],
    ARRAY['bergamot', 'pepper'],
    ARRAY['lavender', 'sichuan pepper', 'elemi', 'pink pepper', 'vetiver', 'geranium'],
    ARRAY['ambroxan', 'cedar', 'labdanum'],
    'loud',
    '8+h',
    'EDP',
    ARRAY['warm', 'cold'],
    ARRAY['night', 'date', 'casual', 'sport'],
    ARRAY['spring', 'summer', 'fall', 'winter'],
    ARRAY['bold', 'masculine', 'fresh', 'spicy', 'powerful'],
    'luxury',
    'https://www.fragrantica.com/perfume/Dior/Sauvage-Eau-de-Parfum-44190.html'
),

-- 3. Dolce & Gabbana Light Blue (Designer, Fresh Citrus)
(
    'Light Blue',
    'Dolce & Gabbana',
    'designer',
    'fresh',
    ARRAY['citrus', 'fruity'],
    ARRAY['lemon', 'apple', 'cedar', 'bellflower'],
    ARRAY['jasmine', 'bamboo', 'rose'],
    ARRAY['amber', 'musk', 'cedar'],
    'subtle',
    '2-4h',
    'EDT',
    ARRAY['warm', 'humid'],
    ARRAY['casual', 'sport', 'date'],
    ARRAY['spring', 'summer'],
    ARRAY['fresh', 'clean', 'light', 'citrusy', 'feminine', 'playful'],
    'mid-range',
    'https://www.fragrantica.com/perfume/Dolce-Gabbana/Light-Blue-161.html'
),

-- 4. Yves Saint Laurent La Nuit de l'Homme (Designer, Oriental Woody)
(
    'La Nuit de l''Homme',
    'Yves Saint Laurent',
    'designer',
    'amber',
    ARRAY['spicy', 'woody'],
    ARRAY['cardamom', 'bergamot', 'cedar'],
    ARRAY['lavender', 'coumarin'],
    ARRAY['vetiver', 'caraway', 'cedar'],
    'moderate',
    '4-8h',
    'EDT',
    ARRAY['cold', 'dry'],
    ARRAY['date', 'night', 'formal'],
    ARRAY['fall', 'winter'],
    ARRAY['sexy', 'mysterious', 'sophisticated', 'masculine', 'seductive'],
    'mid-range',
    'https://www.fragrantica.com/perfume/Yves-Saint-Laurent/La-Nuit-de-l-Homme-5521.html'
),

-- 5. Viktor & Rolf Flowerbomb (Designer, Floral)
(
    'Flowerbomb',
    'Viktor & Rolf',
    'designer',
    'floral',
    ARRAY['gourmand'],
    ARRAY['tea', 'bergamot', 'osmanthus'],
    ARRAY['sambac jasmine', 'orange blossom', 'cattleya orchid', 'freesia', 'rose'],
    ARRAY['patchouli', 'musk', 'tonka bean'],
    'loud',
    '8+h',
    'EDP',
    ARRAY['cold', 'dry'],
    ARRAY['date', 'night', 'formal'],
    ARRAY['fall', 'winter'],
    ARRAY['bold', 'feminine', 'sweet', 'sexy', 'sophisticated'],
    'luxury',
    'https://www.fragrantica.com/perfume/Viktor-Rolf/Flowerbomb-1120.html'
),

-- ============================================================================
-- NICHE FRAGRANCES
-- ============================================================================

-- 6. Creed Aventus (Niche, Fresh Fruity)
(
    'Aventus',
    'Creed',
    'niche',
    'fresh',
    ARRAY['fruity', 'chypre'],
    ARRAY['pineapple', 'bergamot', 'black currant', 'apple'],
    ARRAY['birch', 'patchouli', 'rose', 'jasmine'],
    ARRAY['musk', 'oakmoss', 'ambergris', 'vanilla'],
    'loud',
    '8+h',
    'EDP',
    ARRAY['warm', 'dry'],
    ARRAY['office', 'date', 'formal', 'signature'],
    ARRAY['spring', 'summer', 'fall'],
    ARRAY['bold', 'sophisticated', 'fruity', 'masculine', 'powerful', 'confident'],
    'luxury',
    'https://www.fragrantica.com/perfume/Creed/Aventus-9828.html'
),

-- 7. Tom Ford Tobacco Vanille (Niche, Amber Spicy)
(
    'Tobacco Vanille',
    'Tom Ford',
    'niche',
    'amber',
    ARRAY['spicy', 'gourmand'],
    ARRAY['tobacco leaf', 'spicy notes'],
    ARRAY['vanilla', 'cocoa', 'tobacco blossom', 'tonka bean'],
    ARRAY['dried fruits', 'woody notes'],
    'loud',
    '8+h',
    'EDP',
    ARRAY['cold', 'dry'],
    ARRAY['night', 'date', 'formal', 'signature'],
    ARRAY['fall', 'winter'],
    ARRAY['bold', 'sophisticated', 'warm', 'sweet', 'sexy', 'luxurious'],
    'luxury',
    'https://www.fragrantica.com/perfume/Tom-Ford/Tobacco-Vanille-1825.html'
),

-- 8. Maison Francis Kurkdjian Baccarat Rouge 540 (Niche, Amber Floral)
(
    'Baccarat Rouge 540',
    'Maison Francis Kurkdjian',
    'niche',
    'amber',
    ARRAY['floral'],
    ARRAY['jasmine', 'saffron'],
    ARRAY['amberwood', 'ambergris'],
    ARRAY['fir resin', 'cedar'],
    'loud',
    '8+h',
    'EDP',
    ARRAY['warm', 'cold', 'dry'],
    ARRAY['date', 'night', 'formal', 'signature'],
    ARRAY['spring', 'summer', 'fall', 'winter'],
    ARRAY['sophisticated', 'luxurious', 'unique', 'modern', 'sweet', 'unisex'],
    'luxury',
    'https://www.fragrantica.com/perfume/Maison-Francis-Kurkdjian/Baccarat-Rouge-540-31084.html'
),

-- 9. Le Labo Santal 33 (Niche, Woody Spicy)
(
    'Santal 33',
    'Le Labo',
    'niche',
    'woody',
    ARRAY['spicy', 'aromatic'],
    ARRAY['cardamom', 'iris', 'violet'],
    ARRAY['sandalwood', 'papyrus', 'cedarwood'],
    ARRAY['leather', 'amber', 'musk'],
    'moderate',
    '4-8h',
    'EDP',
    ARRAY['warm', 'cold', 'dry'],
    ARRAY['casual', 'office', 'date', 'signature'],
    ARRAY['spring', 'summer', 'fall', 'winter'],
    ARRAY['sophisticated', 'unique', 'unisex', 'modern', 'clean', 'woody'],
    'luxury',
    'https://www.fragrantica.com/perfume/Le-Labo/Santal-33-12201.html'
),

-- 10. Byredo Gypsy Water (Niche, Woody Aromatic)
(
    'Gypsy Water',
    'Byredo',
    'niche',
    'woody',
    ARRAY['aromatic', 'citrus'],
    ARRAY['bergamot', 'lemon', 'pepper', 'juniper berries'],
    ARRAY['incense', 'pine needle', 'orris'],
    ARRAY['amber', 'sandalwood', 'vanilla'],
    'subtle',
    '4-8h',
    'EDP',
    ARRAY['warm', 'cold'],
    ARRAY['casual', 'office', 'date'],
    ARRAY['spring', 'summer', 'fall'],
    ARRAY['sophisticated', 'clean', 'fresh', 'unisex', 'minimalist', 'modern'],
    'luxury',
    'https://www.fragrantica.com/perfume/Byredo/Gypsy-Water-6138.html'
),

-- ============================================================================
-- AFFORDABLE/MID-RANGE OPTIONS
-- ============================================================================

-- 11. Versace Eros (Designer, Fresh Aromatic)
(
    'Eros',
    'Versace',
    'designer',
    'fresh',
    ARRAY['aromatic', 'fougere'],
    ARRAY['mint', 'lemon', 'green apple'],
    ARRAY['tonka bean', 'geranium', 'ambroxan'],
    ARRAY['vanilla', 'oakmoss', 'vetiver', 'cedar'],
    'loud',
    '8+h',
    'EDT',
    ARRAY['warm'],
    ARRAY['night', 'date', 'sport', 'casual'],
    ARRAY['spring', 'summer', 'fall'],
    ARRAY['bold', 'masculine', 'fresh', 'sweet', 'youthful', 'playful'],
    'mid-range',
    'https://www.fragrantica.com/perfume/Versace/Eros-16657.html'
),

-- 12. Prada L'Homme (Designer, Fresh Aromatic)
(
    'L''Homme Prada',
    'Prada',
    'designer',
    'fresh',
    ARRAY['aromatic', 'fougere'],
    ARRAY['neroli', 'black pepper', 'carrot seeds'],
    ARRAY['iris', 'geranium', 'mate'],
    ARRAY['amber', 'cedar', 'patchouli', 'sandalwood'],
    'subtle',
    '4-8h',
    'EDT',
    ARRAY['warm', 'cold'],
    ARRAY['office', 'casual', 'date'],
    ARRAY['spring', 'summer', 'fall'],
    ARRAY['sophisticated', 'clean', 'fresh', 'masculine', 'minimalist', 'elegant'],
    'luxury',
    'https://www.fragrantica.com/perfume/Prada/Prada-L-Homme-28335.html'
),

-- 13. Narciso Rodriguez For Her (Designer, Floral Musk)
(
    'For Her Eau de Toilette',
    'Narciso Rodriguez',
    'designer',
    'floral',
    ARRAY['musk', 'woody'],
    ARRAY['osmanthus', 'bergamot'],
    ARRAY['african orange flower', 'rose', 'peach'],
    ARRAY['musk', 'amber', 'sandalwood', 'vetiver'],
    'moderate',
    '4-8h',
    'EDT',
    ARRAY['warm', 'cold'],
    ARRAY['office', 'date', 'casual'],
    ARRAY['spring', 'summer', 'fall', 'winter'],
    ARRAY['sophisticated', 'feminine', 'clean', 'sexy', 'elegant', 'modern'],
    'mid-range',
    'https://www.fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-For-Her-Eau-de-Toilette-611.html'
),

-- 14. Acqua di Gio Profumo (Designer, Aquatic Aromatic)
(
    'Acqua di Gio Profumo',
    'Giorgio Armani',
    'designer',
    'fresh',
    ARRAY['aquatic', 'aromatic'],
    ARRAY['bergamot', 'marine notes'],
    ARRAY['geranium', 'rosemary', 'sage'],
    ARRAY['incense', 'patchouli', 'musk'],
    'moderate',
    '4-8h',
    'EDP',
    ARRAY['warm', 'humid'],
    ARRAY['casual', 'date', 'sport', 'office'],
    ARRAY['spring', 'summer', 'fall'],
    ARRAY['fresh', 'aquatic', 'sophisticated', 'masculine', 'clean', 'versatile'],
    'mid-range',
    'https://www.fragrantica.com/perfume/Giorgio-Armani/Acqua-di-Gio-Profumo-34246.html'
),

-- 15. Montblanc Legend (Designer, Fresh Aromatic)
(
    'Legend',
    'Montblanc',
    'designer',
    'fresh',
    ARRAY['aromatic', 'fougere'],
    ARRAY['lavender', 'pineapple', 'bergamot', 'lemon verbena'],
    ARRAY['oakmoss', 'geranium', 'coumarin', 'apple', 'rose', 'pomarosa molecule'],
    ARRAY['sandalwood', 'tonka bean', 'evernyl'],
    'moderate',
    '4-8h',
    'EDT',
    ARRAY['warm', 'cold'],
    ARRAY['office', 'casual', 'date'],
    ARRAY['spring', 'summer', 'fall'],
    ARRAY['fresh', 'sophisticated', 'masculine', 'clean', 'versatile'],
    'affordable',
    'https://www.fragrantica.com/perfume/Montblanc/Legend-10030.html'
);

-- Add comment about seed data
COMMENT ON TABLE public.perfumes IS 'Sample perfumes added for testing. Mix of designer and niche fragrances with diverse characteristics.';

