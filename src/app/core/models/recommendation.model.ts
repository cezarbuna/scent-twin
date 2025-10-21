export interface Recommendation {
  id: string;
  userId: string;
  perfumeId: string;
  perfume?: any; // Will be populated with Perfume data
  score: number; // 0-100 match score
  matchReasons: MatchReason[];
  cohortId: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  createdAt: Date;
  
  // Gamification
  unlockMethod?: UnlockMethod;
  revealProgress?: number; // 0-100 percentage
}

export interface MatchReason {
  category: 'notes' | 'personality' | 'occasion' | 'style' | 'season' | 'color-analysis';
  description: string;
  weight: number; // contribution to overall score
}

export type UnlockMethod = 
  | 'free-reveal'           // First 3 are free
  | 'micro-task'            // Complete a task
  | 'daily-unlock'          // Daily free unlock
  | 'premium-subscription'  // Premium access
  | 'referral-reward'       // Referred friends
  | 'social-share';         // Shared on social media

export interface UnlockTask {
  id: string;
  type: 'share' | 'review' | 'survey' | 'watch-video' | 'visit-link';
  title: string;
  description: string;
  reward: 'unlock-one' | 'unlock-three' | 'premium-trial';
  estimatedTime: number; // in seconds
  externalUrl?: string;
  completed: boolean;
  completedAt?: Date;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  perfumeIds: string[];
  userCount: number;
  averageProfile: any; // Aggregated user preferences
  createdAt: Date;
}

export interface RecommendationEngine {
  userId: string;
  cohortId: string;
  preferences: any;
  selfieFeatures?: any;
  quizResults: any;
  recommendedPerfumes: Recommendation[];
  lastUpdated: Date;
}

export interface UserWardrobe {
  userId: string;
  savedPerfumes: SavedPerfume[];
  wishlist: string[]; // Array of perfume IDs
  owned: string[];    // Array of perfume IDs
}

export interface SavedPerfume {
  perfumeId: string;
  savedAt: Date;
  notes?: string;
  rating?: number;
  owned: boolean;
  wishlist: boolean;
}

