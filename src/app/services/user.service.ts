import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api';  // L'URL de l'API Laravel

  constructor(private http: HttpClient) {}

  // Inscription de l'utilisateur
  register(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.http.post(`${this.apiUrl}/register`, body);
  }

  // Récupérer les informations de l'utilisateur (exemple)
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }
}
