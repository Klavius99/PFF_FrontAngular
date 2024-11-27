import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  createAdmin(adminData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-admin`, adminData);
  }

  createInfoManager(infoManagerData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-info-manager`, infoManagerData);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }
}
