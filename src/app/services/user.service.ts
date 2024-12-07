import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createAdmin(adminData: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/admins`, {
      ...adminData,
      role: 'admin'
    }, { headers }).pipe(
      catchError(error => {
        console.error('Error creating admin:', error);
        return throwError(() => error);
      })
    );
  }

  createInfoManager(infoManagerData: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/info-managers`, {
      ...infoManagerData,
      role: 'info_manager'
    }, { headers }).pipe(
      catchError(error => {
        console.error('Error creating info manager:', error);
        return throwError(() => error);
      })
    );
  }

  getInfoManagers(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/info-managers`, { headers });
  }

  deleteInfoManager(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/info-managers/${id}`, { headers });
  }

  getUsers(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  getUserStats(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/users/stats`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user stats:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(userId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    try {
      const headers = this.getHeaders();
      return this.http.get<User>(`${this.apiUrl}/user`, { headers }).pipe(
        tap(user => {
          console.log('User data received:', user);
          // Mettre à jour les données utilisateur dans le localStorage
          localStorage.setItem('user', JSON.stringify(user));
        }),
        catchError(error => {
          console.error('Error details:', error);
          if (error.status === 401) {
            // Token invalide ou expiré
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.authService.logout();
          }
          return throwError(() => error);
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getUserById(userId: number): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return throwError(() => new Error('Failed to fetch user details'));
      })
    );
  }
}
