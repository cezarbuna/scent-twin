/**
 * Database Types
 * Generated from Supabase schema
 * 
 * This file defines the exact database schema types.
 * Use the interfaces in other model files for application logic.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          primary_goals: string[]
          intended_contexts: string[]
          climate_preferences: string[]
          projection_preference: string | null
          longevity_expectation: string | null
          sensitivity_flags: string[]
          budget_band: string | null
          note_likes: string[]
          note_dislikes: string[]
          brand_preference: string | null
          scenario_weights: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          primary_goals?: string[]
          intended_contexts?: string[]
          climate_preferences?: string[]
          projection_preference?: string | null
          longevity_expectation?: string | null
          sensitivity_flags?: string[]
          budget_band?: string | null
          note_likes?: string[]
          note_dislikes?: string[]
          brand_preference?: string | null
          scenario_weights?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          primary_goals?: string[]
          intended_contexts?: string[]
          climate_preferences?: string[]
          projection_preference?: string | null
          longevity_expectation?: string | null
          sensitivity_flags?: string[]
          budget_band?: string | null
          note_likes?: string[]
          note_dislikes?: string[]
          brand_preference?: string | null
          scenario_weights?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      selfies_derived: {
        Row: {
          id: string
          user_id: string
          season_subtype: string | null
          undertone: string | null
          value_level: string | null
          contrast_level: string | null
          confidence_score: number | null
          analysis_date: string
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          season_subtype?: string | null
          undertone?: string | null
          value_level?: string | null
          contrast_level?: string | null
          confidence_score?: number | null
          analysis_date?: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          season_subtype?: string | null
          undertone?: string | null
          value_level?: string | null
          contrast_level?: string | null
          confidence_score?: number | null
          analysis_date?: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "selfies_derived_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      perfumes: {
        Row: {
          id: string
          name: string
          brand: string
          brand_type: string | null
          family: string | null
          subfamilies: string[]
          top_notes: string[]
          heart_notes: string[]
          base_notes: string[]
          projection: string | null
          longevity: string | null
          strength: string | null
          climate_tags: string[]
          scenario_tags: string[]
          season_tags: string[]
          vibe_descriptors: string[]
          price_band: string | null
          availability_status: string
          fragrantica_url: string | null
          official_brand_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          brand_type?: string | null
          family?: string | null
          subfamilies?: string[]
          top_notes?: string[]
          heart_notes?: string[]
          base_notes?: string[]
          projection?: string | null
          longevity?: string | null
          strength?: string | null
          climate_tags?: string[]
          scenario_tags?: string[]
          season_tags?: string[]
          vibe_descriptors?: string[]
          price_band?: string | null
          availability_status?: string
          fragrantica_url?: string | null
          official_brand_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          brand_type?: string | null
          family?: string | null
          subfamilies?: string[]
          top_notes?: string[]
          heart_notes?: string[]
          base_notes?: string[]
          projection?: string | null
          longevity?: string | null
          strength?: string | null
          climate_tags?: string[]
          scenario_tags?: string[]
          season_tags?: string[]
          vibe_descriptors?: string[]
          price_band?: string | null
          availability_status?: string
          fragrantica_url?: string | null
          official_brand_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_ratings: {
        Row: {
          id: string
          user_id: string
          perfume_id: string
          owns_perfume: boolean
          opening_rating: number | null
          dry_down_rating: number | null
          projection_rating: number | null
          longevity_rating: number | null
          compliments_rating: number | null
          scenario_context: string | null
          overall_rating: number | null
          user_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          perfume_id: string
          owns_perfume?: boolean
          opening_rating?: number | null
          dry_down_rating?: number | null
          projection_rating?: number | null
          longevity_rating?: number | null
          compliments_rating?: number | null
          scenario_context?: string | null
          overall_rating?: number | null
          user_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          perfume_id?: string
          owns_perfume?: boolean
          opening_rating?: number | null
          dry_down_rating?: number | null
          projection_rating?: number | null
          longevity_rating?: number | null
          compliments_rating?: number | null
          scenario_context?: string | null
          overall_rating?: number | null
          user_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_ratings_perfume_id_fkey"
            columns: ["perfume_id"]
            referencedRelation: "perfumes"
            referencedColumns: ["id"]
          }
        ]
      }
      wardrobes: {
        Row: {
          id: string
          user_id: string
          perfume_id: string
          context: string
          personal_notes: string | null
          price_alert_enabled: boolean
          price_alert_threshold: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          perfume_id: string
          context: string
          personal_notes?: string | null
          price_alert_enabled?: boolean
          price_alert_threshold?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          perfume_id?: string
          context?: string
          personal_notes?: string | null
          price_alert_enabled?: boolean
          price_alert_threshold?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wardrobes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wardrobes_perfume_id_fkey"
            columns: ["perfume_id"]
            referencedRelation: "perfumes"
            referencedColumns: ["id"]
          }
        ]
      }
      price_offers: {
        Row: {
          id: string
          perfume_id: string
          retailer_name: string
          retailer_url: string
          price: number
          currency: string
          size_ml: number | null
          is_affiliate_link: boolean
          affiliate_url: string | null
          last_checked_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          perfume_id: string
          retailer_name: string
          retailer_url: string
          price: number
          currency?: string
          size_ml?: number | null
          is_affiliate_link?: boolean
          affiliate_url?: string | null
          last_checked_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          perfume_id?: string
          retailer_name?: string
          retailer_url?: string
          price?: number
          currency?: string
          size_ml?: number | null
          is_affiliate_link?: boolean
          affiliate_url?: string | null
          last_checked_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_offers_perfume_id_fkey"
            columns: ["perfume_id"]
            referencedRelation: "perfumes"
            referencedColumns: ["id"]
          }
        ]
      }
      recommendations_history: {
        Row: {
          id: string
          user_id: string
          perfume_id: string
          recommendation_type: string | null
          personal_fit_score: number | null
          scenario_fit_score: number | null
          cohort_score: number | null
          final_score: number | null
          revealed_at: string | null
          unlock_method: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          perfume_id: string
          recommendation_type?: string | null
          personal_fit_score?: number | null
          scenario_fit_score?: number | null
          cohort_score?: number | null
          final_score?: number | null
          revealed_at?: string | null
          unlock_method?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          perfume_id?: string
          recommendation_type?: string | null
          personal_fit_score?: number | null
          scenario_fit_score?: number | null
          cohort_score?: number | null
          final_score?: number | null
          revealed_at?: string | null
          unlock_method?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_history_perfume_id_fkey"
            columns: ["perfume_id"]
            referencedRelation: "perfumes"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_weekly_free_reveals: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      has_completed_quiz: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

