import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User, userProfileFromDb } from '@core/models';

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
        return { success: false, error: this.transformErrorMessage(error.message) };
      }

      if (data.user) {
        // User and profile records are created automatically by database trigger
        // Set user and navigate to goal selection
        await this.setUser(data.user);
        this.router.navigate(['/goals']);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: this.transformErrorMessage(error.message) };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      const { data, error } = await this.supabase.getClient().auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
        });
        return { success: false, error: this.transformErrorMessage(error.message) };
      }

      console.log('✅ Sign in successful, user:', data.user?.id);

      if (data.user) {
        await this.setUser(data.user);
        // Check if user has completed goal selection
        const profile = this.currentUser()?.profile;
        if (!profile?.primaryGoals || profile.primaryGoals.length === 0) {
          this.router.navigate(['/goals']);
        } else {
          this.router.navigate(['/recommendations']);
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('❌ Unexpected sign in error:', error);
      return { success: false, error: this.transformErrorMessage(error.message) };
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.getClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) {
        return { success: false, error: this.transformErrorMessage(error.message) };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: this.transformErrorMessage(error.message) };
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
   * Note: User and profile records are created automatically by database trigger
   * on auth.users INSERT. No manual creation needed.
   */

  /**
   * Set current user
   */
    private async setUser(user: any): Promise<void> {
        console.log('🔍 setUser called with user:', user);

        // Fetch full user profile from database
        // Use maybeSingle() instead of single() to handle 0 or 1 rows gracefully
        const query = this.supabase.getClient()
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id);
        
        console.log('🔍 Executing query:', query);
        console.log('🔍 Query details:', {
            table: 'user_profiles',
            select: '*',
            filter: `user_id = ${user.id}`,
            user_id: user.id,
            auth_uid: 'Will be checked in RLS'
        });

        const { data: profile, error } = await query.maybeSingle();

        console.log('📊 Profile fetch result:', { profile, error });
        console.log('📊 Error details:', error ? {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        } : 'No error');

        if (error) {
            console.error('❌ Error fetching user profile:', error);
        }

        if (!profile) {
            console.warn('⚠️ No profile found for user:', user.id);
            console.log('🔍 Checking if this is an RLS issue...');
            
            // Try to debug RLS by checking auth.uid()
            const { data: authCheck } = await this.supabase.getClient()
                .from('user_profiles')
                .select('user_id')
                .limit(1);
            
            console.log('🔍 Auth check result:', authCheck);
        } else {
            console.log('✅ Profile found:', profile);
        }

        const fullUser: User = {
            id: user.id,
            email: user.email,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at),
            profile: profile ? userProfileFromDb(profile) : undefined,
        };

        console.log('👤 Full user object:', fullUser);
        console.log('📋 Profile after transformation:', fullUser.profile);

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

  /**
   * Update user profile with selected goals
   */
  async updateUserGoals(goals: string[], scenarioWeights?: Record<string, number>): Promise<{ success: boolean; error?: string }> {
    try {
      const user = this.currentUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Create equal weights for selected goals if not provided
      const weights = scenarioWeights || goals.reduce((acc, goal) => {
        acc[goal.toLowerCase().replace(/\s+/g, '_')] = 1.0 / goals.length;
        return acc;
      }, {} as Record<string, number>);

      const { error } = await this.supabase.getClient()
        .from('user_profiles')
        .update({
          primary_goals: goals,
          scenario_weights: weights,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: this.transformErrorMessage(error.message) };
      }

      // Refresh user data
      await this.setUser({ id: user.id, email: user.email });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: this.transformErrorMessage(error.message) };
    }
  }

  /**
   * Transform Supabase error messages to user-friendly messages
   */
  private transformErrorMessage(message: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Incorrect email or password. Please try again.',
      'User already registered': 'An account with this email already exists. Try signing in.',
      'Email not confirmed': 'Please check your email and confirm your account before signing in.',
      'Password should be at least 6 characters': 'Password must be at least 8 characters long.',
      'Unable to validate email address': 'Please enter a valid email address.',
      'Signups not allowed': 'New registrations are currently disabled. Please contact support.',
      'User not found': 'No account found with this email address.',
    };

    // Check for exact matches
    for (const [key, value] of Object.entries(errorMap)) {
      if (message.includes(key)) {
        return value;
      }
    }

    // Default fallback
    if (message.toLowerCase().includes('network')) {
      return 'Connection error. Please check your internet and try again.';
    }

    return message;
  }
}

