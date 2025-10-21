export const environment = {
  production: true,
  
  // Supabase Configuration
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  },
  
  // API Endpoints
  api: {
    fragrantica: 'https://www.fragrantica.com',
  },
  
  // Feature Flags
  features: {
    selfieAnalysis: true,
    gamification: true,
    darkMode: true,
  },
  
  // Analytics
  analytics: {
    enabled: true,
    trackingId: 'YOUR_ANALYTICS_ID',
  },
};

