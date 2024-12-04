import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Post } from '../../../models/post';
import { Comment } from '../../../models/comment';
import { PostService } from '../../../services/post.service';
import { CommentService } from '../../../services/comment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post?: Post;
  comments: Comment[] = [];
  newComment: string = '';
  isLiked: boolean = false;
  likesCount: number = 0;
  currentUser: any;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.route.params.subscribe(params => {
      const postId = +params['id'];
      if (postId) {
        this.loadPost(postId);
      } else {
        this.error = 'ID du post invalide';
        this.loading = false;
      }
    });
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

  private loadPost(postId: number): void {
    this.loading = true;
    this.error = null;

    this.postService.getPost(postId).subscribe({
      next: (post: Post) => {
        this.post = post;
        this.loadComments();
        this.checkIfLiked();
        this.countLikes();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading post:', error);
        this.error = 'Impossible de charger le post. Veuillez réessayer.';
        this.loading = false;
        this.router.navigate(['/dashboard/default']);
      }
    });
  }

  loadComments(): void {
    if (!this.post?.id) return;

    this.commentService.getComments(this.post.id).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
      },
      error: (error: any) => {
        console.error('Error loading comments:', error);
        this.error = 'Erreur lors du chargement des commentaires';
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim() || !this.post?.id) return;

    this.commentService.addComment(this.post.id, this.newComment.trim()).subscribe({
      next: (comment: Comment) => {
        this.comments.unshift(comment);
        this.newComment = '';
      },
      error: (error: any) => {
        console.error('Error adding comment:', error);
        this.error = 'Erreur lors de l\'ajout du commentaire';
      }
    });
  }

  toggleLike(): void {
    if (!this.post?.id) return;

    this.postService.toggleLike(this.post.id).subscribe({
      next: () => {
        this.isLiked = !this.isLiked;
        this.likesCount += this.isLiked ? 1 : -1;
      },
      error: (error: any) => {
        console.error('Error toggling like:', error);
        this.error = 'Erreur lors de la mise à jour du like';
      }
    });
  }

  private checkIfLiked(): void {
    if (!this.post?.id) return;

    this.postService.isLiked(this.post.id).subscribe({
      next: (isLiked: boolean) => {
        this.isLiked = isLiked;
      },
      error: (error: any) => {
        console.error('Error checking like status:', error);
        this.error = 'Erreur lors de la vérification du like';
      }
    });
  }

  private countLikes(): void {
    if (!this.post?.id) return;

    this.postService.getLikesCount(this.post.id).subscribe({
      next: (count: number) => {
        this.likesCount = count;
      },
      error: (error: any) => {
        console.error('Error counting likes:', error);
        this.error = 'Erreur lors du comptage des likes';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/default']);
  }
}
