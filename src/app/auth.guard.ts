import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Route guard that ensures a user is authenticated before allowing
// access to a route.  If not authenticated it redirects to the
// login page and returns false.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    console.log("unauth");
    
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};