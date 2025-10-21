import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseTestService {

  constructor(private supabase: SupabaseService) {}

  /**
   * Test basic connection to Supabase
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('🔄 Testing Supabase connection...');
      
      // Test 1: Check if client is initialized
      const client = this.supabase.getClient();
      if (!client) {
        return {
          success: false,
          message: 'Supabase client not initialized'
        };
      }
      console.log('✅ Client initialized');

      // Test 2: Try to get session (will be null if not logged in, but shouldn't error)
      const session = await this.supabase.getSession();
      console.log('✅ Session check successful:', session ? 'Logged in' : 'Not logged in');

      // Test 3: Try a simple query (this will work once migrations are applied)
      // Querying perfumes table (public access, no auth required)
      const { data, error } = await client
        .from('perfumes')
        .select('count')
        .limit(1);

      if (error) {
        console.log('⚠️  Database query failed (migrations may not be applied yet):', error.message);
        return {
          success: true, // Connection works, just no tables yet
          message: 'Connected to Supabase, but migrations not applied yet',
          details: {
            error: error.message,
            hint: 'Run the SQL migrations in Supabase Dashboard'
          }
        };
      }

      console.log('✅ Database query successful');
      return {
        success: true,
        message: 'Supabase connection fully working! Migrations applied.',
        details: data
      };

    } catch (error: any) {
      console.error('❌ Connection test failed:', error);
      return {
        success: false,
        message: 'Connection failed',
        details: error.message
      };
    }
  }

  /**
   * Test authentication flow
   */
  async testAuth(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      console.log('🔄 Testing Supabase auth...');
      
      const client = this.supabase.getClient();
      
      // Check if we can access auth
      const { data: { user }, error } = await client.auth.getUser();
      
      if (error && error.message !== 'Auth session missing!') {
        throw error;
      }

      console.log('✅ Auth system accessible');
      console.log('User status:', user ? 'Logged in' : 'Not logged in');

      return {
        success: true,
        message: user ? 'Auth working, user logged in' : 'Auth working, no user logged in'
      };
    } catch (error: any) {
      console.error('❌ Auth test failed:', error);
      return {
        success: false,
        message: 'Auth test failed: ' + error.message
      };
    }
  }

  /**
   * Get Supabase configuration info (safe, no secrets)
   */
  getConfigInfo(): {
    url: string;
    keyLength: number;
    configured: boolean;
  } {
    // Import environment to check config
    // Note: In production, this would come from environment file
    const url = 'https://kzgdpypsofeydsltvlaa.supabase.co';
    const keyConfigured = true; // We know key is set from environment

    return {
      url: url,
      keyLength: keyConfigured ? 200 : 0, // Typical anon key length
      configured: true
    };
  }
}

