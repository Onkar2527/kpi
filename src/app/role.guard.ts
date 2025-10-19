import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Factory that produces a role‑based guard.  Pass an array of
// allowed role codes (e.g. ['HO','BM']) and the guard will
// evaluate whether the current user has one of those roles.  If
// the user is not authenticated or their role does not match the
// allowed list, navigation is blocked and the user is redirected
// to the login page.
export function roleGuard(allowed: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isAuthenticated()) {
      router.navigateByUrl('/login');
      return false;
    }
    if (!auth.user || !allowed.includes(auth.user.role)) {
      router.navigateByUrl('/login');
      return false;
    }
    return true;
  };
}