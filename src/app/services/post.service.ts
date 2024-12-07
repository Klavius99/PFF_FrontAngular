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
  private postCreatedSubject = new Subject<void>();
  postCreated = this.postCreatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createPost(formData: FormData): Observable<Post> {
    const token = this.authService.getToken();
    console.log('Token pour createPost:', token ? 'Présent' : 'Absent');

    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    // Log des données du formulaire avant l'envoi
    console.log('Contenu du FormData:');
    formData.forEach((value, key) => {
      if (key === 'image' || key === 'video') {
        const file = value as File;
        console.log(`${key}:`, {
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
        });
      } else {
        console.log(`${key}:`, value);
      }
    });

    return this.http.post<Post>(`${this.apiUrl}/posts`, formData, { 
      headers,
      withCredentials: true
    }).pipe(
      tap({
        next: (response) => {
          console.log('Post créé avec succès:', response);
          this.postCreatedSubject.next();
        },
        error: (error) => {
          console.error('Erreur détaillée lors de la création du post:', error);
          if (error.error) {
            console.error('Message d\'erreur du serveur:', error.error);
            console.error('Status:', error.status);
            console.error('Status Text:', error.statusText);
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
      'Authorization': `Bearer ${token}`
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
          throw error;
        }
      })
    );
  }

  getPosts(): Observable<Post[]> {
    const token = this.authService.getToken();
    console.log('Token pour getPosts:', token ? 'Présent' : 'Absent');
    
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    console.log('Envoi de la requête GET /posts avec headers:', headers.keys());

    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { 
      headers,
      withCredentials: true
    }).pipe(
      tap({
        next: (posts) => {
          console.log('Posts récupérés avec succès. Nombre:', posts.length);
          console.log('Premier post:', posts[0]);
        },
        error: (error) => {
          console.error('Erreur détaillée lors de la récupération des posts:', error);
          if (error.error) {
            console.error('Message d\'erreur du serveur:', error.error);
          }
          console.error('Status:', error.status);
          console.error('Status Text:', error.statusText);
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
      'Authorization': `Bearer ${token}`
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
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/posts/${postId}/like`, {}, { 
      headers,
      withCredentials: true 
    });
  }

  isLiked(postId: number): Observable<boolean> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
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
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<boolean>(`${this.apiUrl}/posts/${postId}/like/check`, { 
      headers,
      withCredentials: true
    });
  }

  getLikesCount(postId: number): Observable<number> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<number>(`${this.apiUrl}/posts/${postId}/likes/count`, { 
      headers,
      withCredentials: true
    });
  }

  getCommentsCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/posts/${postId}/comments/count`);
  }

  getComments(postId: number): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/posts/${postId}/comments`, { 
      headers,
      withCredentials: true
    }).pipe(
      tap({
        next: (comments) => {
          console.log('Commentaires récupérés avec succès:', comments);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des commentaires:', error);
          throw error;
        }
      })
    );
  }

  addComment(postId: number, content: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/posts/${postId}/comments`, { content }, { 
      headers,
      withCredentials: true
    }).pipe(
      tap({
        next: (response) => {
          console.log('Commentaire ajouté avec succès:', response);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du commentaire:', error);
          throw error;
        }
      })
    );
  }
}
