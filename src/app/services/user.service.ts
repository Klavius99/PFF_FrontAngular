import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  createAdmin(adminData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admins`, adminData);
  }

  createInfoManager(infoManagerData: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/info-managers`, infoManagerData);
  }

  getInfoManagers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/info-managers`);
  }

  deleteInfoManager(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/info-managers/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
