import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Loading state -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto"></div>
      </div>

      <!-- Error state -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {{ error }}
      </div>

      <!-- Posts list -->
      <div *ngFor="let post of posts" class="bg-white rounded-xl shadow-lg p-6">
        <!-- Post header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <img 
              [src]="getMediaUrl(post.user?.profile_picture || 'assets/images/profil_anime.jpeg')" 
              alt="Profile" 
              class="h-10 w-10 rounded-full object-cover"
              (error)="handleMediaError($event)"
            >
            <div class="ml-3">
              <p class="font-semibold text-gray-900">{{ post.user?.username }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</p>
            </div>
          </div>

          <!-- Delete button (only for post owner or admin) -->
          <button 
            *ngIf="canDeletePost(post)"
            (click)="deletePost(post.id)"
            class="text-gray-400 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Post content -->
        <p class="text-gray-800 mb-4 whitespace-pre-wrap">{{ post.content }}</p>

        <!-- Post media -->
        <div *ngIf="post.image_url || post.video_url" class="mb-4">
          <!-- Image -->
          <img 
            *ngIf="post.image_url" 
            [src]="getMediaUrl(post.image_url)" 
            alt="Post image" 
            class="rounded-lg max-h-96 w-full object-cover"
            (error)="handleMediaError($event)"
          >
          <!-- Video -->
          <video 
            *ngIf="post.video_url" 
            [src]="getMediaUrl(post.video_url)" 
            class="rounded-lg max-h-96 w-full"
            controls
            preload="metadata"
            (error)="handleMediaError($event)"
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>

        <!-- Post footer -->
        <div class="flex items-center justify-between text-gray-500">
          <div class="flex items-center space-x-4">
            <!-- Like button (à implémenter) -->
            <button class="flex items-center space-x-2 hover:text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>0</span>
            </button>

            <!-- Comment button (à implémenter) -->
            <button class="flex items-center space-x-2 hover:text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>0</span>
            </button>
          </div>
        </div>
      </div>

      <!-- No posts state -->
      <div *ngIf="!loading && !error && posts.length === 0" class="text-center py-8 text-gray-500">
        Aucun post pour le moment
      </div>
    </div>
  `,
  styles: []
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = true;
  error = '';
  currentUser: any;
  private postCreatedListener: any;
  private apiUrl = environment.apiUrl;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.getCurrentUser();

    // Écouter les nouveaux posts
    this.postCreatedListener = () => {
      this.loadPosts();
    };
    window.addEventListener('postCreated', this.postCreatedListener);
  }

  ngOnDestroy() {
    window.removeEventListener('postCreated', this.postCreatedListener);
  }

  private getCurrentUser() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  loadPosts() {
    this.loading = true;
    this.error = '';
    
    console.log('Début du chargement des posts');
    this.postService.getPosts().subscribe({
      next: (posts) => {
        console.log('Posts reçus:', posts);
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        if (error.status === 401) {
          this.error = 'Vous devez être connecté pour voir les posts';
        } else if (error.status === 500) {
          this.error = 'Erreur serveur lors du chargement des posts';
        } else {
          this.error = 'Erreur lors du chargement des posts';
        }
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Moins d'une minute
    if (diff < 60000) {
      return 'À l\'instant';
    }
    
    // Moins d'une heure
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    // Moins d'un jour
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    }
    
    // Moins d'une semaine
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
    
    // Format date standard
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  canDeletePost(post: Post): boolean {
    if (!this.currentUser) return false;
    return post.user_id === this.currentUser.id || 
           ['admin', 'super_admin'].includes(this.currentUser.role);
  }

  deletePost(postId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;

    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== postId);
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        alert('Erreur lors de la suppression du post');
      }
    });
  }

  openImage(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  getMediaUrl(url: string | null): string {
    if (!url) return '';
    // Si l'URL est déjà absolue, la retourner telle quelle
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Sinon, construire l'URL complète
    const baseUrl = this.apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }

  handleMediaError(event: any) {
    const mediaElement = event.target;
    console.error('Erreur de chargement du média:', {
      src: mediaElement.src,
      type: mediaElement.tagName.toLowerCase()
    });
    mediaElement.style.display = 'none';
  }
}
