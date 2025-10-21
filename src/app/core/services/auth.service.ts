import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use Angular Signals for reactive state
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state
   */
  private async initializeAuth(): Promise<void> {
    try {
      // Check for existing session
      const session = await this.supabase.getSession();
      
      if (session?.user) {
        await this.setUser(session.user);
      }

      // Listen to auth changes
      this.supabase.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await this.setUser(session.user);
        } else {
          this.clearUser();
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.getClient().auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile in database
        await this.createUserProfile(data.user.id, email);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.getClient().auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await this.setUser(data.user);
        this.router.navigate(['/recommendations']);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await this.supabase.getClient().auth.signOut();
      this.clearUser();
      this.router.navigate(['/welcome']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.getClient().auth.resetPasswordForEmail(email);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.getClient().auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create user profile in database
   */
  private async createUserProfile(userId: string, email: string): Promise<void> {
    try {
      await this.supabase.getClient()
        .from('user_profiles')
        .insert({
          user_id: userId,
          email,
          quiz_completed: false,
          is_premium: false,
          unlocked_perfumes: [],
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  /**
   * Set current user
   */
  private async setUser(user: any): Promise<void> {
    // Fetch full user profile from database
    const { data: profile } = await this.supabase.getClient()
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const fullUser: User = {
      id: user.id,
      email: user.email,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
      profile: profile || undefined,
    };

    this.currentUser.set(fullUser);
    this.isAuthenticated.set(true);
  }

  /**
   * Clear current user
   */
  private clearUser(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  /**
   * Get current user value
   */
  getCurrentUserValue(): User | null {
    return this.currentUser();
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }
}

