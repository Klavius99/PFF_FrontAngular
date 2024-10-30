import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost/api/register'; // Changez ceci avec l'URL de votre API

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, JSON.stringify(data), { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Une erreur est survenue:', error.error.message);
    } else {
      console.error(`Backend retourné le code ${error.status}, ` +
                    `body était: ${error.error}`);
    }
    return throwError('Quelque chose s\'est mal passé; veuillez réessayer plus tard.');
  }
}