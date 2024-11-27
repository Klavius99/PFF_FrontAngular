import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated().pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
          });
          return of(false);
        }
        return authService.hasRole(allowedRoles);
      }),
      map(hasRole => {
        if (!hasRole) {
          // Récupérer l'utilisateur actuel pour la redirection basée sur le rôle
          const currentUser = authService.getCurrentUser();
          currentUser.pipe(take(1)).subscribe(user => {
            if (user) {
              console.warn(`Accès refusé - Rôle requis: ${allowedRoles.join(', ')}, Rôle actuel: ${user.role}`);
              
              // Redirection basée sur le rôle
              switch (user.role) {
                case 'super_admin':
                case 'admin':
                  router.navigate(['/dashboard-admin']);
                  break;
                case 'info_manager':
                  router.navigate(['/dashboard-info']);
                  break;
                default:
                  router.navigate(['/dashboard']);
              }
            }
          });
        }
        return hasRole;
      })
    );
  };
};
