import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Post {
  id: number;
  content: string;
  image_url?: string;
  user_id: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    email: string;
    profile_picture?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createPost(formData: FormData): Observable<Post> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    // Configuration des en-têtes
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    // Log des détails de la requête
    console.log('Création de post:');
    console.log('URL:', `${this.apiUrl}/posts`);
    console.log('Token:', token);
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(key, ':', value.name, value.type, value.size);
      } else {
        console.log(key, ':', value);
      }
    });

    // Envoi de la requête
    return this.http.post<Post>(`${this.apiUrl}/posts`, formData, { 
      headers,
      withCredentials: true // Nécessaire car supports_credentials est true dans la config CORS
    }).pipe(
      tap({
        next: (response) => {
          console.log('Post créé avec succès:', response);
        },
        error: (error) => {
          console.error('Erreur lors de la création du post:', error);
          if (error.error) {
            console.error('Message d\'erreur du serveur:', error.error);
          }
          console.error('Status:', error.status);
          console.error('Status Text:', error.statusText);
          if (error.message) {
            console.error('Message:', error.message);
          }
          throw error;
        }
      })
    );
  }

  getPosts(): Observable<Post[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { 
      headers,
      withCredentials: true
    });
  }

  deletePost(postId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.delete(`${this.apiUrl}/posts/${postId}`, { 
      headers,
      withCredentials: true
    });
  }
}
