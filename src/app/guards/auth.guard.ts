import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    take(1),
    map(isAuthenticated => {
      // Si l'utilisateur est authentifié
      if (isAuthenticated) {
        // Si l'utilisateur essaie d'accéder aux pages de login/register
        if (state.url.includes('/login') || state.url.includes('/register')) {
          router.navigate(['/dashboard']);
          return false;
        }
        return true;
      }

      // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une page protégée
      if (!state.url.includes('/login') && !state.url.includes('/register')) {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }

      return true;
    })
  );
};
