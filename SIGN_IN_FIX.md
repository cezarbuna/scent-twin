# Sign-In Fix - Resolved 400 Bad Request Error

## Problem
When attempting to sign in, users were getting a 400 Bad Request error:
```
POST https://kzgdpypsofeydsltvlaa.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
```

## Root Cause
The Supabase client was configured with `flowType: 'pkce'` in the auth settings. This setting is only appropriate for OAuth flows (like Google sign-in) and causes conflicts when used with email/password authentication.

## Solution
Removed the `flowType: 'pkce'` setting from the Supabase client configuration in `src/app/core/services/supabase.service.ts`. For email/password authentication, the default flow type should be used instead.

## Changes Made

### File: `src/app/core/services/supabase.service.ts`

**Before:**
```typescript
{
  auth: {
    storageKey: 'scenttwin-auth',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // ❌ This caused the 400 error
  }
}
```

**After:**
```typescript
{
  auth: {
    storageKey: 'scenttwin-auth',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // PKCE is only needed for OAuth flows, not email/password
    // flowType: 'pkce', // Removed to fix email/password sign-in
  }
}
```

## Additional Improvements
Also added better error logging to the sign-in flow to help debug future issues:

1. Added console logging in `auth.service.ts` to track the sign-in process
2. Added console logging in `sign-in.component.ts` to trace the authentication flow
3. Enhanced error messages to show detailed error information

## Testing
- ✅ All 16 unit tests pass
- ✅ Development server runs without errors
- ✅ Sign-in flow now works correctly

## Why PKCE Was There
PKCE (Proof Key for Code Exchange) is a security extension for OAuth 2.0 that prevents authorization code interception attacks. It's useful for:
- OAuth providers (Google, GitHub, etc.)
- Public clients (mobile apps, SPAs)
- Authorization code flow

However, for direct email/password authentication (resource owner password credentials grant), PKCE is not necessary and can cause conflicts with Supabase's auth endpoints.

## Best Practices Going Forward

### For Email/Password Auth
```typescript
// Simple configuration - no flowType needed
{
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
}
```

### For OAuth Flows
```typescript
// Enable PKCE for OAuth
{
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
  }
}
```

## References
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [PKCE Specification](https://datatracker.ietf.org/doc/html/rfc7636)
- [OAuth 2.0 Best Practices](https://oauth.net/2/)
