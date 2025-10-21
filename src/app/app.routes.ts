import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/onboarding/onboarding.component')
      .then(m => m.OnboardingComponent),
    title: 'Welcome to ScentTwin'
  },
  {
    path: 'selfie',
    canActivate: [authGuard],
    loadComponent: () => import('./features/selfie/selfie.component')
      .then(m => m.SelfieComponent),
    title: 'Selfie Analysis - ScentTwin'
  },
  {
    path: 'quiz',
    canActivate: [authGuard],
    loadComponent: () => import('./features/quiz/quiz.component')
      .then(m => m.QuizComponent),
    title: 'Lifestyle Quiz - ScentTwin'
  },
  {
    path: 'recommendations',
    canActivate: [authGuard],
    loadComponent: () => import('./features/recommendations/recommendations.component')
      .then(m => m.RecommendationsComponent),
    title: 'Your Recommendations - ScentTwin'
  },
  {
    path: 'wardrobe',
    canActivate: [authGuard],
    loadComponent: () => import('./features/wardrobe/wardrobe.component')
      .then(m => m.WardrobeComponent),
    title: 'My Wardrobe - ScentTwin'
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component')
      .then(m => m.ProfileComponent),
    title: 'Profile & Settings - ScentTwin'
  },
  {
    path: '**',
    redirectTo: '/welcome'
  }
];
