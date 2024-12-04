import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/post';
import { AuthService } from '../../../services/auth.service';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = true;
  error = '';
  private postCreatedListener: any;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('PostListComponent initialized');
    this.loadPosts();
    
    // Écouter les nouveaux posts
    this.postCreatedListener = this.postService.postCreated.subscribe(() => {
      this.loadPosts();
    });
  }

  ngOnDestroy() {
    if (this.postCreatedListener) {
      this.postCreatedListener.unsubscribe();
    }
  }

  private loadPosts() {
    this.loading = true;
    this.error = '';
    
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.error = 'Erreur lors du chargement des posts';
        this.loading = false;
      }
    });
  }
}