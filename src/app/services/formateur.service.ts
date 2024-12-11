import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Formateur } from '../models/formateur';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private apiUrl = `${environment.apiUrl}/formateurs`;

  constructor(private http: HttpClient) {}

  getFormateurs(): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(this.apiUrl);
  }

  addFormateur(formateur: Formateur): Observable<Formateur> {
    return this.http.post<Formateur>(this.apiUrl, formateur);
  }

  updateFormateur(formateur: Formateur): Observable<Formateur> {
    return this.http.put<Formateur>(`${this.apiUrl}/${formateur.id}`, formateur);
  }

  deleteFormateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
