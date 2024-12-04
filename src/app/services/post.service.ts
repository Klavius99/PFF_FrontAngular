import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl;
  
  // Add this Subject to notify when a post is created
  private postCreatedSubject = new Subject<void>();
  postCreated = this.postCreatedSubject.asObservable();

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
          // Notify subscribers that a post has been created
          this.postCreatedSubject.next();
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

  getPost(postId: number): Observable<Post> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<Post>(`${this.apiUrl}/posts/${postId}`, { 
      headers,
      withCredentials: true
    }).pipe(
      tap({
        next: (post) => {
          console.log('Post récupéré avec succès:', post);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du post:', error);
          if (error.error) {
            console.error('Message d\'erreur du serveur:', error.error);
          }
          throw error;
        }
      })
    );
  }

  getPosts(): Observable<Post[]> {
    const token = this.authService.getToken();
    console.log('Token récupéré:', token ? 'Présent' : 'Absent');
    
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    console.log('Envoi de la requête GET posts avec headers:', headers);

    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { 
      headers,
      withCredentials: true
    }).pipe(
      tap({
        next: (posts) => {
          console.log('Posts récupérés avec succès:', posts);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des posts:', error);
          if (error.error) {
            console.error('Message d\'erreur du serveur:', error.error);
          }
          throw error;
        }
      })
    );
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

  toggleLike(postId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/posts/${postId}/like`, {}, { headers });
  }

  isLiked(postId: number): Observable<boolean> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<boolean>(`${this.apiUrl}/posts/${postId}/is-liked`, { headers });
  }

  likePost(postId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/posts/${postId}/like`, {}, { headers });
  }

  unlikePost(postId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/posts/${postId}/like`, { headers });
  }

  checkIfLiked(postId: number): Observable<boolean> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<boolean>(`${this.apiUrl}/posts/${postId}/like/check`, { headers });
  }

  getLikesCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/posts/${postId}/likes/count`);
  }

  getCommentsCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/posts/${postId}/comments/count`);
  }

  getComments(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  addComment(postId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/comments`, { content });
  }
}
