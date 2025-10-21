// Copy this file to environment.ts and environment.prod.ts and fill in your actual values

export const environment = {
  production: false,
  
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here',
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

