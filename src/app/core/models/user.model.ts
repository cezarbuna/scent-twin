export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  selfieFeatures?: SelfieFeatures;
  quizCompleted: boolean;
  isPremium: boolean;
  unlockedPerfumes: string[]; // Array of perfume IDs
}

export interface UserPreferences {
  gender?: 'male' | 'female' | 'unisex' | 'prefer-not-to-say';
  ageRange?: string;
  skinTone?: string;
  seasonalPreference?: 'spring' | 'summer' | 'autumn' | 'winter';
  notesPreferences: NotesPreferences;
  occasions: string[];
  priceRange?: PriceRange;
}

export interface NotesPreferences {
  liked: string[];    // Array of note names
  disliked: string[]; // Array of note names
  neutral: string[];  // Array of note names
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface SelfieFeatures {
  // Client-side derived features only (no raw images)
  dominantColors: string[];
  colorPalette: 'warm' | 'cool' | 'neutral';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  processedAt: Date;
}

