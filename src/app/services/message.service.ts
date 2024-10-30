import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8000/api/messages'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  sendMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, message);
  }

  getMessages(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
