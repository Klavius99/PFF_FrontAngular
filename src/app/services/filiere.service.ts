import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Filiere } from '../models/filiere';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  private apiUrl = `${environment.apiUrl}/filieres`;

  constructor(private http: HttpClient) {}

  getFilieres(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(this.apiUrl);
  }

  addFiliere(filiere: Filiere): Observable<Filiere> {
    return this.http.post<Filiere>(this.apiUrl, filiere);
  }

  updateFiliere(filiere: Filiere): Observable<Filiere> {
    return this.http.put<Filiere>(`${this.apiUrl}/${filiere.id}`, filiere);
  }

  deleteFiliere(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
