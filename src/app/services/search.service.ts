import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UserSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  photoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  searchUsers(query: string): Observable<UserSearchResult[]> {
    if (!query.trim()) {
      return of([]);
    }
    return this.http.get<UserSearchResult[]>(`${this.apiUrl}/users/search`, {
      params: { q: query }
    });
  }
}
