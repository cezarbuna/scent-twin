// Test environment configuration
export const environment = {
  production: false,
  
  // Mock Supabase Configuration for testing
  supabase: {
    url: 'https://test.supabase.co',
    anonKey: 'test-anon-key-for-testing-purposes-only',
  },
  
  api: {
    fragrantica: 'https://www.fragrantica.com',
  },
  
  features: {
    selfieAnalysis: true,
    gamification: true,
    darkMode: true,
  },
  
  analytics: {
    enabled: false,
    trackingId: '',
  },
};

