// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  // Supabase Configuration
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  },
  
  // API Endpoints (if using external APIs)
  api: {
    fragrantica: 'https://www.fragrantica.com',
  },
  
  // Feature Flags
  features: {
    selfieAnalysis: true,
    gamification: true,
    darkMode: true,
  },
  
  // Analytics (optional)
  analytics: {
    enabled: false,
    trackingId: '',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

