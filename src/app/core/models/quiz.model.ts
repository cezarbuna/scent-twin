export interface Quiz {
  id: string;
  version: string;
  questions: QuizQuestion[];
  estimatedDuration: number; // in seconds (e.g., 45)
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'multi-select' | 'slider' | 'image-select';
  question: string;
  description?: string;
  options?: QuizOption[];
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
  category: 'lifestyle' | 'preferences' | 'personality' | 'occasions';
}

export interface QuizOption {
  id: string;
  label: string;
  value: string | number;
  imageUrl?: string;
  description?: string;
}

export interface QuizResponse {
  id: string;
  userId: string;
  quizId: string;
  answers: QuizAnswer[];
  completedAt: Date;
  duration: number; // actual time taken in seconds
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number | string[]; // depends on question type
}

export interface QuizResult {
  userId: string;
  profile: UserPersonalityProfile;
  recommendations: string[]; // Array of perfume IDs
  cohortId: string;
  confidence: number; // 0-1
  completedAt: Date;
}

export interface UserPersonalityProfile {
  lifestyle: 'active' | 'relaxed' | 'balanced' | 'adventurous';
  personalityTraits: string[];
  preferredOccasions: string[];
  stylePreference: 'classic' | 'modern' | 'bold' | 'minimalist';
  intensityPreference: 'subtle' | 'moderate' | 'strong';
}

