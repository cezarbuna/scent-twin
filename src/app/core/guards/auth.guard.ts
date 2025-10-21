import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services';

/**
 * Auth guard to protect routes that require authentication
 */
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  }

  // Redirect to welcome page if not authenticated
  return router.createUrlTree(['/welcome']);
};

/**
 * Guest guard to redirect authenticated users away from auth pages
 */
export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isUserAuthenticated()) {
    return true;
  }

  // Redirect to recommendations if already authenticated
  return router.createUrlTree(['/recommendations']);
};

