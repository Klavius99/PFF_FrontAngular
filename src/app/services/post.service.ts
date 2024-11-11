import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePostDto, Post } from '../models/post';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8000/api/posts'; // Update this to your Laravel API URL

  constructor(private http: HttpClient) {}

  createPost(postData: CreatePostDto): Observable<Post> {
    const formData = new FormData();
    formData.append('text', postData.text);
    if (postData.image) {
      formData.append('image', postData.image, postData.image.name);
    }

    return this.http.post<Post>(this.apiUrl, formData);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }
}