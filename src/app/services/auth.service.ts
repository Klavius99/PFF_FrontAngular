import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User, AuthResponse } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: Omit<User, 'id' | 'role' | 'status' | 'created_at'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.user && response.token) {
          this.handleAuthentication(response);
        }
      })
    );
  }

  login(credentials: Pick<User, 'email' | 'password'>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  logout(): Observable<any> {
    return this.http.post(this.apiUrl, {}).pipe(
      tap(() => {
        // Supprimez les informations d'authentification (token, user, etc.) du stockage local
        localStorage.removeItem('token'); // ou sessionStorage selon votre implémentation
        this.router.navigate(['/login']); // Redirigez vers la page de connexion après déconnexion
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(allowedRoles: string[]): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => {
        if (!user || !user.role) return false;
        return allowedRoles.includes(user.role);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {}).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  getFormateurs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/formateurs`);
  }

  getGroupes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/groupes`);
  }

  deleteFormateur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/formateurs/${id}`);
  }

  deleteFormateurFromApi(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/formateurs/${id}`);
  }

  deleteGroupeFromApi(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/groupes/${id}`);
  }

  deleteGroupe(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/groupes/${id}`);
  }
}
