import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Groupe } from '../models/groupe';
import { Filiere } from '../models/filiere';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  private apiUrl = `${environment.apiUrl}/groupes`;
  private filiereUrl = `${environment.apiUrl}/filieres`;

  constructor(private http: HttpClient) {}

  getGroupes(): Observable<Groupe[]> {
    return this.http.get<Groupe[]>(this.apiUrl);
  }

  addGroupe(groupe: Groupe): Observable<Groupe> {
    return this.http.post<Groupe>(this.apiUrl, groupe);
  }

  getFilieres(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(`${environment.apiUrl}/filieres`);
}

  creerGroupe(groupe: Groupe): Observable<Groupe> {
    return this.addGroupe(groupe);
  }

  updateGroupe(groupe: Groupe): Observable<Groupe> {
    return this.http.put<Groupe>(`${this.apiUrl}/${groupe.id}`, groupe);
  }

  deleteGroupe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
