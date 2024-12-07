import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Liste des routes publiques
  const publicRoutes = [
    'login',
    'register',
    'forgot-password',
    'reset-password'
  ];

  // Vérifie si l'URL correspond à une route publique
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));
  
  if (isPublicRoute) {
    return next(req);
  }

  const token = authService.getToken();
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  return next(req);
};
