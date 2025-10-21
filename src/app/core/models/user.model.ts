import { Database } from './database.types';

// Database row types
export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];
export type SelfiesDerivedRow = Database['public']['Tables']['selfies_derived']['Row'];

// Application interfaces (camelCase for frontend use)
export interface User {
  id: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  primaryGoals: string[]; // 'work', 'date_night', 'gym', 'casual', 'signature', 'gifting'
  intendedContexts: string[]; // 'office', 'dates', 'nights_out', 'sport', 'formal', 'casual_daily'
  climatePreferences: string[]; // 'warm', 'cold', 'humid', 'dry'
  projectionPreference?: string; // 'subtle', 'moderate', 'loud'
  longevityExpectation?: string; // '2-4h', '4-8h', '8+h'
  sensitivityFlags: string[];
  budgetBand?: string; // 'affordable', 'mid-range', 'luxury'
  noteLikes: string[];
  noteDislikes: string[];
  brandPreference?: string; // 'niche', 'designer', 'no_preference'
  scenarioWeights: Record<string, number>; // { work: 0.8, date: 0.6, etc. }
  createdAt: Date;
  updatedAt: Date;
}

export interface SelfieFeatures {
  id: string;
  userId: string;
  // Seasonal color analysis (computed client-side)
  seasonSubtype?: string; // 'soft_autumn', 'bright_spring', 'deep_winter', etc.
  undertone?: string; // 'cool', 'neutral', 'warm'
  valueLevel?: string; // 'light', 'medium', 'deep'
  contrastLevel?: string; // 'low', 'medium', 'high'
  confidenceScore?: number; // 0.0 to 1.0
  analysisDate: Date;
  deletedAt?: Date; // Soft delete for privacy
  createdAt: Date;
  updatedAt: Date;
}

// Helper functions to convert between database and application types
export function userFromDb(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function userProfileFromDb(row: UserProfileRow): UserProfile {
  return {
    id: row.id,
    userId: row.user_id,
    primaryGoals: row.primary_goals || [],
    intendedContexts: row.intended_contexts || [],
    climatePreferences: row.climate_preferences || [],
    projectionPreference: row.projection_preference || undefined,
    longevityExpectation: row.longevity_expectation || undefined,
    sensitivityFlags: row.sensitivity_flags || [],
    budgetBand: row.budget_band || undefined,
    noteLikes: row.note_likes || [],
    noteDislikes: row.note_dislikes || [],
    brandPreference: row.brand_preference || undefined,
    scenarioWeights: (row.scenario_weights as Record<string, number>) || {},
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function selfieFeaturesFromDb(row: SelfiesDerivedRow): SelfieFeatures {
  return {
    id: row.id,
    userId: row.user_id,
    seasonSubtype: row.season_subtype || undefined,
    undertone: row.undertone || undefined,
    valueLevel: row.value_level || undefined,
    contrastLevel: row.contrast_level || undefined,
    confidenceScore: row.confidence_score || undefined,
    analysisDate: new Date(row.analysis_date),
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

