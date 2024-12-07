import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-post bg-white rounded-lg shadow p-4">
      <div class="flex gap-3 items-center">
        <img src="assets/images/profil_anime.jpeg" alt="" class="w-10 h-10 rounded-full">
        <textarea
          [(ngModel)]="content"
          placeholder="Que voulez-vous partager ?"
          class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="3"
          maxlength="1000"
        ></textarea>
      </div>

      <!-- Prévisualisation du média -->
      <div *ngIf="previewUrl" class="mt-3 relative">
        <video *ngIf="isVideo" [src]="previewUrl" alt="Prévisualisation" class="max-h-48 rounded-lg" controls></video>
        <img *ngIf="!isVideo" [src]="previewUrl" alt="Prévisualisation" class="max-h-48 rounded-lg">
        <button
          (click)="removeMedia()"
          class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="mt-3 flex justify-between items-center">
        <div class="flex gap-3">
          <button
            (click)="triggerImageUpload()"
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            [class.text-blue-500]="selectedImage"
          >
            <i class="fas fa-image"></i>
            <span>Image</span>
          </button>
          <button
            (click)="triggerVideoUpload()"
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            [class.text-blue-500]="selectedVideo"
          >
            <i class="fas fa-video"></i>
            <span>Vidéo</span>
          </button>
        </div>

        <button
          (click)="createPost()"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="isSubmitting || (!content?.trim() && !selectedImage && !selectedVideo)"
        >
          {{ isSubmitting ? 'Publication...' : 'Publier' }}
        </button>
      </div>

      <div *ngIf="error" class="mt-3 text-red-500">
        {{ error }}
      </div>

      <!-- Input caché pour l'image -->
      <input
        #imageInput
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif"
        (change)="onFileSelected($event, 'image')"
        style="display: none"
      >

      <!-- Input caché pour la vidéo -->
      <input
        #videoInput
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        (change)="onFileSelected($event, 'video')"
        style="display: none"
      >
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CreatePostComponent implements OnDestroy {
  content: string = '';
  selectedImage: File | null = null;
  selectedVideo: File | null = null;
  previewUrl: string | null = null;
  isVideo: boolean = false;
  isSubmitting: boolean = false;
  error: string = '';

  constructor(private postService: PostService) {}

  triggerImageUpload() {
    const imageInput = document.querySelector('input[type="file"][accept*="image"]') as HTMLInputElement;
    imageInput?.click();
  }

  triggerVideoUpload() {
    const videoInput = document.querySelector('input[type="file"][accept*="video"]') as HTMLInputElement;
    videoInput?.click();
  }

  removeMedia() {
    this.selectedImage = null;
    this.selectedVideo = null;
    this.previewUrl = null;
    this.isVideo = false;
  }

  onFileSelected(event: Event, type: 'image' | 'video') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Vérification de la taille du fichier
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB pour images, 100MB pour vidéos
    if (file.size > maxSize) {
      this.error = `La taille du fichier ne doit pas dépasser ${maxSize / (1024 * 1024)}MB`;
      return;
    }

    // Réinitialiser l'autre type de média
    if (type === 'image') {
      this.selectedImage = file;
      this.selectedVideo = null;
      this.isVideo = false;
    } else {
      this.selectedVideo = file;
      this.selectedImage = null;
      this.isVideo = true;
    }

    // Créer l'URL de prévisualisation
    this.previewUrl = URL.createObjectURL(file);
  }

  createPost() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.error = '';

    const formData = new FormData();
    formData.append('content', this.content.trim());
    
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

    this.postService.createPost(formData).subscribe({
      next: () => {
        this.content = '';
        this.removeMedia();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Erreur lors de la création du post:', error);
        this.error = 'Une erreur est survenue lors de la création du post';
        this.isSubmitting = false;
      }
    });
  }

  ngOnDestroy() {
    // Nettoyer les URLs de prévisualisation
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}
