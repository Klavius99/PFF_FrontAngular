import { Component } from '@angular/core';
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

      <!-- Prévisualisation de l'image -->
      <div *ngIf="previewUrl" class="mt-3 relative">
        <img [src]="previewUrl" alt="Prévisualisation" class="max-h-48 rounded-lg">
        <button
          (click)="removeImage()"
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
        </div>

        <button
          (click)="createPost()"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="isSubmitting || (!content?.trim() && !selectedImage)"
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
        (change)="onFileSelected($event)"
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
export class CreatePostComponent {
  content: string = '';
  selectedImage: File | null = null;
  previewUrl: string | null = null;
  isSubmitting: boolean = false;
  error: string = '';

  constructor(private postService: PostService) {}

  triggerImageUpload() {
    const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    imageInput?.click();
  }

  removeImage() {
    this.selectedImage = null;
    this.previewUrl = null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Vérification de la taille du fichier (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB en octets
    if (file.size > maxSize) {
      this.error = 'La taille de l\'image ne doit pas dépasser 2MB';
      return;
    }

    // Vérification du type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.error = 'Format d\'image non supporté. Utilisez JPG, PNG ou GIF';
      return;
    }

    // Prévisualisation de l'image
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.selectedImage = file;
    this.error = '';
  }

  createPost() {
    if (this.isSubmitting) return;
    if (!this.content?.trim() && !this.selectedImage) {
      this.error = 'Veuillez ajouter du texte ou une image à votre post';
      return;
    }

    if (this.content?.length > 1000) {
      this.error = 'Le texte ne doit pas dépasser 1000 caractères';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    const formData = new FormData();
    formData.append('content', this.content?.trim() || '');
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        // Réinitialisation du formulaire
        this.content = '';
        this.selectedImage = null;
        this.previewUrl = null;
        this.isSubmitting = false;
        
        // Notification de création réussie
        window.dispatchEvent(new CustomEvent('postCreated'));
      },
      error: (error) => {
        console.error('Erreur lors de la création du post:', error);
        
        if (error.status === 422 && error.error?.errors) {
          // Erreurs de validation
          const errorMessages = Object.values(error.error.errors).flat();
          this.error = errorMessages.join('\n');
        } else {
          this.error = error.error?.message || 'Une erreur est survenue lors de la création du post';
        }
        
        this.isSubmitting = false;
      }
    });
  }
}
