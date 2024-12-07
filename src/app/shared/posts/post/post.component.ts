import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../models/post';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { PostModule } from './post.module';
import { TimeAgoPipe } from './time-ago.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PostModule,
    FormsModule,
    DialogModule
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() post?: Post;
  isLiked: boolean = false;
  likesCount: number = 0;
  currentUser: any;
  error: string | null = null;
  commentText: string = '';
  isSubmittingComment: boolean = false;
  displayModal: boolean = false;
  comments: any[] = [];
  isLoadingComments: boolean = false;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  
  isPlaying: boolean = false;
  isMuted: boolean = true;
  videoProgress: number = 0;
  private observer: IntersectionObserver | null = null;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Post:', this.post);
    if (this.post?.id) {
      this.checkIfLiked();
      this.countLikes();
      this.countComments();
    }
    this.getCurrentUser();
  }

  ngAfterViewInit() {
    if (this.post?.video_url) {
      this.setupVideoIntersectionObserver();
      this.setupVideoProgress();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private getCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error getting current user:', error);
        this.error = 'Erreur lors de la récupération de l\'utilisateur';
      }
    });
  }

  async toggleLike(event: Event) {
    event.preventDefault();
    if (!this.post?.id) return;

    try {
      if (this.isLiked) {
        await this.postService.unlikePost(this.post.id).toPromise();
        this.isLiked = false;
        this.likesCount--;
      } else {
        await this.postService.likePost(this.post.id).toPromise();
        this.isLiked = true;
        this.likesCount++;
      }
    } catch (error) {
      console.error('Erreur lors du like/unlike:', error);
      // Optionally show error message to user
    }
  }

  viewDetails(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.displayModal = true;
    this.loadComments();
  }

  navigateToProfile(event: Event): void {
    event.stopPropagation(); // Empêche la propagation vers viewDetails()
    
    // Vérifier si l'utilisateur est connecté
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        if (this.post?.user?.id) {
          this.router.navigate(['/profil', this.post.user.id]);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  private async checkIfLiked() {
    if (!this.post?.id) return;
    try {
      const isLiked = await this.postService.checkIfLiked(this.post.id).toPromise();
      this.isLiked = !!isLiked;
    } catch (error) {
      console.error('Erreur lors de la vérification du like:', error);
    }
  }

  private async countLikes() {
    if (!this.post?.id) return;
    try {
      const count = await this.postService.getLikesCount(this.post.id).toPromise();
      this.likesCount = count || 0;
    } catch (error) {
      console.error('Erreur lors du comptage des likes:', error);
    }
  }

  private countComments(): void {
    if (this.post?.id) {
      this.postService.getCommentsCount(this.post.id).subscribe({
        next: (count) => {
          if (this.post) {
            this.post.comments_count = count;
          }
        },
        error: (error) => {
          console.error('Erreur lors du comptage des commentaires:', error);
        }
      });
    }
  }

  loadComments(): void {
    if (!this.post?.id) return;
    
    this.isLoadingComments = true;
    this.postService.getComments(this.post.id).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commentaires:', error);
        this.isLoadingComments = false;
      }
    });
  }

  showComments(): void {
    this.displayModal = true;
    this.loadComments();
  }

  submitComment(): void {
    if (!this.commentText.trim() || !this.post?.id || this.isSubmittingComment) {
      return;
    }

    this.isSubmittingComment = true;
    this.postService.addComment(this.post.id, this.commentText).subscribe({
      next: (response) => {
        console.log('Commentaire ajouté:', response);
        this.commentText = '';
        if (this.post) {
          this.post.comments_count = (this.post.comments_count || 0) + 1;
        }
        this.loadComments(); // Recharger les commentaires après l'ajout
        this.isSubmittingComment = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        // Afficher un message d'erreur à l'utilisateur
        alert('Une erreur est survenue lors de l\'ajout du commentaire. Veuillez réessayer.');
        this.isSubmittingComment = false;
      }
    });
  }

  private setupVideoProgress() {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.addEventListener('timeupdate', () => {
        const video = this.videoPlayer.nativeElement;
        this.videoProgress = (video.currentTime / video.duration) * 100;
      });
    }
  }

  private setupVideoIntersectionObserver() {
    if (!this.videoPlayer?.nativeElement) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.videoPlayer?.nativeElement) {
            this.videoPlayer.nativeElement.play()
              .then(() => {
                this.isPlaying = true;
              })
              .catch(error => {
                console.error('Error playing video:', error);
              });
          }
        } else {
          if (this.videoPlayer?.nativeElement) {
            this.videoPlayer.nativeElement.pause();
            this.isPlaying = false;
          }
        }
      });
    }, options);

    this.observer.observe(this.videoPlayer.nativeElement);
  }

  playVideo() {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch(error => {
          console.error('Error playing video:', error);
        });
    }
  }

  pauseVideo() {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.pause();
      this.isPlaying = false;
    }
  }

  toggleVideo() {
    if (this.isPlaying) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }

  toggleMute() {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.muted = !this.videoPlayer.nativeElement.muted;
      this.isMuted = this.videoPlayer.nativeElement.muted;
    }
  }

  getImageUrl(url: string | null): string {
    if (!url) return 'assets/images/default-post.jpg';
    if (url.startsWith('http')) return url;
    return `${environment.apiUrl.replace('/api', '')}/${url}`;
  }
}
