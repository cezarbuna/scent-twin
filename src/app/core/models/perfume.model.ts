export interface Perfume {
  id: string;
  name: string;
  brand: string;
  description: string;
  imageUrl?: string;
  gender: 'male' | 'female' | 'unisex';
  releaseYear?: number;
  
  // Fragrance composition
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  
  // Classification
  fragranceFamily: string;
  subFamily?: string;
  
  // Metadata
  longevity: 'weak' | 'moderate' | 'long-lasting' | 'eternal';
  sillage: 'soft' | 'moderate' | 'heavy' | 'enormous';
  
  // External links
  fragranticaUrl?: string;
  
  // Pricing
  priceRange?: 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury';
  
  // Occasions
  occasions: string[];
  seasons: string[];
  
  // Rating
  averageRating?: number;
  totalRatings?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface PerfumeNote {
  id: string;
  name: string;
  category: 'top' | 'middle' | 'base';
  family: string;
  description?: string;
}

export interface PerfumeReview {
  id: string;
  perfumeId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  longevity?: 'weak' | 'moderate' | 'long-lasting' | 'eternal';
  sillage?: 'soft' | 'moderate' | 'heavy' | 'enormous';
  createdAt: Date;
}

