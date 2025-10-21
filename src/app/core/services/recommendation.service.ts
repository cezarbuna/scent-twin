import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Recommendation, Perfume, UnlockTask } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  // Reactive state using signals
  recommendations = signal<Recommendation[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private supabase: SupabaseService) {}

  /**
   * Get personalized recommendations for the current user
   */
  async getRecommendations(userId: string, limit: number = 20): Promise<Recommendation[]> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.supabase.getClient()
        .from('recommendations')
        .select(`
          *,
          perfume:perfumes(*)
        `)
        .eq('user_id', userId)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      const recommendations = (data || []) as Recommendation[];
      this.recommendations.set(recommendations);
      return recommendations;
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      this.error.set(error.message);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Get top recommendations (highest scoring)
   */
  async getTopRecommendations(userId: string, count: number = 5): Promise<Recommendation[]> {
    const allRecommendations = await this.getRecommendations(userId, count);
    return allRecommendations.slice(0, count);
  }

  /**
   * Unlock a perfume recommendation
   */
  async unlockRecommendation(
    recommendationId: string, 
    unlockMethod: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.getClient()
        .from('recommendations')
        .update({
          is_unlocked: true,
          unlocked_at: new Date().toISOString(),
          unlock_method: unlockMethod,
        })
        .eq('id', recommendationId);

      if (error) {
        throw error;
      }

      // Update local state
      const updatedRecommendations = this.recommendations().map(rec => {
        if (rec.id === recommendationId) {
          return { ...rec, isUnlocked: true, unlockedAt: new Date() };
        }
        return rec;
      });
      this.recommendations.set(updatedRecommendations);

      return { success: true };
    } catch (error: any) {
      console.error('Error unlocking recommendation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get perfume details by ID
   */
  async getPerfumeDetails(perfumeId: string): Promise<Perfume | null> {
    try {
      const { data, error } = await this.supabase.getClient()
        .from('perfumes')
        .select('*')
        .eq('id', perfumeId)
        .single();

      if (error) {
        throw error;
      }

      return data as Perfume;
    } catch (error: any) {
      console.error('Error fetching perfume details:', error);
      return null;
    }
  }

  /**
   * Get available unlock tasks
   */
  async getUnlockTasks(userId: string): Promise<UnlockTask[]> {
    try {
      const { data, error } = await this.supabase.getClient()
        .from('unlock_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []) as UnlockTask[];
    } catch (error: any) {
      console.error('Error fetching unlock tasks:', error);
      return [];
    }
  }

  /**
   * Complete an unlock task
   */
  async completeUnlockTask(taskId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.getClient()
        .from('unlock_tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error completing unlock task:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate new recommendations based on quiz results
   */
  async generateRecommendations(
    userId: string,
    quizResults: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // This would typically call a Supabase Edge Function
      const { data, error } = await this.supabase.getClient()
        .functions
        .invoke('generate-recommendations', {
          body: { userId, quizResults },
        });

      if (error) {
        throw error;
      }

      // Refresh recommendations
      await this.getRecommendations(userId);

      return { success: true };
    } catch (error: any) {
      console.error('Error generating recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clear recommendations from state
   */
  clearRecommendations(): void {
    this.recommendations.set([]);
    this.error.set(null);
  }
}

