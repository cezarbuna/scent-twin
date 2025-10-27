# ScentTwin Auth - Quick Reference Guide

## 🚀 Quick Start

### Run the App
```bash
ng serve
# Navigate to http://localhost:4200
```

### Run Tests
```bash
npm test
# All 16 tests should pass
```

---

## 📍 Routes

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | - | No | Redirects to `/welcome` |
| `/welcome` | OnboardingComponent | No | Welcome screen |
| `/auth` | AuthContainerComponent | No* | Auth layout (redirects to `/recommendations` if authenticated) |
| `/auth/sign-in` | SignInComponent | No* | Sign-in form |
| `/auth/sign-up` | SignUpComponent | No* | Sign-up form |
| `/goals` | GoalSelectionComponent | **Yes** | Goal selection |
| `/selfie` | SelfieComponent | **Yes** | Selfie capture (next step) |
| `/quiz` | QuizComponent | **Yes** | Preferences quiz |
| `/recommendations` | RecommendationsComponent | **Yes** | Perfume recommendations |
| `/wardrobe` | WardrobeComponent | **Yes** | Saved perfumes |
| `/profile` | ProfileComponent | **Yes** | User settings |

*Uses `guestGuard` - redirects authenticated users away

---

## 🔑 Auth Service Methods

```typescript
import { AuthService } from '@core/services';

// Sign up with email/password
await authService.signUp(email, password);
// → Creates user, creates profile, redirects to /goals

// Sign in with email/password
await authService.signIn(email, password);
// → Checks profile, redirects to /goals or /recommendations

// Sign in with Google
await authService.signInWithGoogle();
// → OAuth flow, redirects after success

// Reset password
await authService.resetPassword(email);
// → Sends reset email via Supabase

// Update user goals
await authService.updateUserGoals(['work_office', 'date_night']);
// → Saves to user_profiles, calculates scenario weights

// Sign out
await authService.signOut();
// → Clears session, redirects to /welcome

// Get current user
const user = authService.currentUser(); // Signal
const isAuth = authService.isAuthenticated(); // Signal
```

---

## 🎯 Goal IDs

Use these IDs when calling `updateUserGoals()`:

```typescript
const GOAL_IDS = {
  SIGNATURE: 'signature_scent',
  WORK: 'work_office',
  CASUAL: 'casual_day',
  DATE: 'date_night',
  NIGHT_OUT: 'night_out',
  GYM: 'gym_sport',
  GIFTING: 'gifting'
};
```

---

## 🎨 Reusable Components

### Tooltip Component
```typescript
import { TooltipComponent } from '@shared/components/tooltip/tooltip.component';

// In template:
<app-tooltip position="top">
  Your tooltip content here
</app-tooltip>
```

### Progress Stepper Component
```typescript
import { ProgressStepperComponent, Step } from '@shared/components/progress-stepper/progress-stepper.component';

steps: Step[] = [
  { label: 'Create Account', status: 'completed' },
  { label: 'Select Goals', status: 'current' },
  { label: 'Selfie', status: 'upcoming' }
];

// In template:
<app-progress-stepper [steps]="steps"></app-progress-stepper>
```

---

## 🔒 Route Guards

### Protect a Route
```typescript
import { authGuard } from '@core/guards/auth.guard';

{
  path: 'my-protected-route',
  component: MyComponent,
  canActivate: [authGuard]  // Requires authentication
}
```

### Prevent Authenticated Access
```typescript
import { guestGuard } from '@core/guards/auth.guard';

{
  path: 'login',
  component: LoginComponent,
  canActivate: [guestGuard]  // Redirects if already logged in
}
```

---

## 🎭 Form Validation Patterns

### Email Validation
```typescript
email: ['', [Validators.required, Validators.email]]
```

### Password Validation
```typescript
password: ['', [
  Validators.required,
  Validators.minLength(8),
  this.passwordStrengthValidator  // Custom: requires letters + numbers
]]
```

### Password Match Validation
```typescript
// Form-level validator
this.fb.group({
  password: [''],
  confirmPassword: ['']
}, {
  validators: this.passwordMatchValidator
});
```

---

## 🎨 CSS Variables Available

From `src/assets/styles/_variables.css`:

```css
/* Brand Colors */
--color-primary: #ff6b9d;
--color-accent: #ffd700;
--gradient-primary: linear-gradient(135deg, #ff6b9d 0%, #c94b8e 100%);

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

/* Font Sizes */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;

/* Glassmorphism */
--glass-background: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: blur(20px);
```

---

## 🐛 Common Issues & Solutions

### Issue: Tests failing with "No provider for Router"
**Solution:** Add `provideRouter([])` to test providers

### Issue: "NavigatorLockManager" warnings in console
**Solution:** Already handled in `supabase.service.ts` - warnings are suppressed in dev

### Issue: Google OAuth not working
**Solution:** Configure Google OAuth in Supabase Dashboard:
1. Go to Authentication → Providers
2. Enable Google
3. Add Client ID and Secret from Google Cloud Console
4. Add redirect URLs

### Issue: Form not submitting
**Solution:** Check for validation errors:
```typescript
if (this.form.invalid) {
  this.form.markAllAsTouched(); // Shows all validation errors
  return;
}
```

### Issue: User redirected to wrong page after login
**Solution:** Check `user_profiles.primary_goals` in database
- Empty array → redirects to `/goals`
- Has goals → redirects to `/recommendations`

---

## 📦 Database Schema Reminder

### user_profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_goals TEXT[] DEFAULT '{}',  -- Selected goals
  scenario_weights JSONB DEFAULT '{}',  -- Calculated weights
  -- ... other fields
);
```

### Important Fields for Auth Flow
- `primary_goals`: Array of goal IDs (`['work_office', 'date_night']`)
- `scenario_weights`: Object with weights (`{ work_office: 0.5, date_night: 0.5 }`)

---

## 🎯 User Flow Diagram

```
┌─────────────┐
│   Welcome   │
│   Screen    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  /auth/     │
│  sign-up    │◄─── New users
│             │
│  /auth/     │
│  sign-in    │◄─── Returning users
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   /goals    │◄─── Required if primary_goals empty
│  Selection  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  /selfie    │◄─── Optional
│   Capture   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   /quiz     │◄─── Preferences
│ Questionnaire│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│/recommendations│◄─── Final destination
│   Perfume    │
│    Cards     │
└──────────────┘
```

---

## 🚀 Ready to Use!

All authentication features are fully implemented and tested. You can now:

1. ✅ Sign up new users
2. ✅ Sign in existing users
3. ✅ Authenticate with Google
4. ✅ Reset passwords
5. ✅ Select fragrance goals
6. ✅ Protect routes
7. ✅ Manage user sessions

**Next Step:** Implement the `/selfie` component for color analysis!

