// admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api'; // Remplacez par l'URL de votre API Laravel

  constructor(private http: HttpClient) {}

  addFormateur(formateur: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/formateurs`, formateur);
  }

  addGroupe(groupe: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/groupes`, groupe);
  }

  getFilieres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/filieres`);
  }
}