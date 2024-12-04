import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="Post flex flex-col w-full bg-slate-600 p-4 rounded-lg space-y-4">
        <!-- Section de l'avatar et du champ de texte -->
        <div class="flex gap-3 items-center">
            <img src="assets/images/profil.jpeg" alt="" class="profil-photo">
            <input type="text" 
                   [(ngModel)]="postText"
                   placeholder="Ecrivez quelque chose ici ..." 
                   class="w-full p-2 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-800">
        </div>

        <!-- Prévisualisation de l'image -->
        <div *ngIf="previewUrl" class="mt-2 relative">
            <img [src]="previewUrl" 
                 alt="Prévisualisation" 
                 class="rounded-lg max-h-48 w-auto">
            <button (click)="resetForm()" 
                    class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                <span>&times;</span>
            </button>
        </div>
        
        <!-- Section des boutons de fonctionnalité -->
        <div class="flex justify-between items-center mt-2">
            <!-- Bouton Photo pour télécharger une image -->
            <div class="flex items-center gap-2 cursor-pointer" (click)="triggerImageUpload()">
                <img src="assets/images/image-icon.svg" alt="Photo" class="w-6 h-6 button-file">
                <span class="text-gray-300 hover:text-white">Photo</span>
            </div>

            <!-- Bouton Vidéo pour télécharger une vidéo -->
            <div class="flex items-center gap-2 cursor-pointer" (click)="triggerVideoUpload()">
                <img src="assets/images/video-icon.svg" alt="Vidéo" class="w-6 h-6 button-file">
                <span class="text-gray-300 hover:text-white">Vidéo</span>
            </div>

            <!-- Bouton Poster -->
            <button (click)="onPost()" 
                    [disabled]="isSubmitting"
                    class="flex items-center gap-2 bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed">
                <img src="assets/images/post-icon.svg" alt="Poster" class="w-5 h-5 button-file">
                <span>{{ isSubmitting ? 'Publication...' : 'Poster' }}</span>
            </button>
        </div>

        <!-- Texte pour afficher le nom du fichier sélectionné -->
        <div *ngIf="uploadedFileName" class="text-sm text-gray-100 mt-2">
            Fichier sélectionné : {{ uploadedFileName }}
        </div>

        <!-- Inputs cachés -->
        <input type="file" 
               id="imageInput" 
               accept="image/jpeg,image/png,image/jpg,image/gif" 
               style="display: none;" 
               (change)="onFilePicked($event, 'image')">
        <input type="file" 
               id="videoInput" 
               accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm" 
               style="display: none;" 
               (change)="onFilePicked($event, 'video')">
    </div>
  `,
  styles: [`
    .profil-photo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }
    .button-file {
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
    }
  `]
})
export class CreatePostComponent {
  selectedImage: File | null = null;
  selectedVideo: File | null = null;
  uploadedFileName: string | null = null;
  postText: string = '';
  isSubmitting = false;
  previewUrl: string | null = null;
  error: string | null = null;

  // Constantes pour les limites de fichiers
  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  private readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];

  constructor(private postService: PostService) {}

  triggerImageUpload() {
    const imageInput = document.getElementById('imageInput') as HTMLInputElement;
    imageInput.click();
  }

  triggerVideoUpload() {
    const videoInput = document.getElementById('videoInput') as HTMLInputElement;
    videoInput.click();
  }

  onFilePicked(event: Event, type: 'image' | 'video') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Réinitialiser les erreurs précédentes
    this.error = null;

    // Vérifier le type de fichier
    if (type === 'image') {
      if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        this.error = 'Type de fichier non autorisé. Veuillez sélectionner une image (JPEG, PNG, GIF)';
        return;
      }
      if (file.size > this.MAX_IMAGE_SIZE) {
        this.error = 'L\'image est trop volumineuse. La taille maximale est de 10MB';
        return;
      }
      this.selectedImage = file;
      this.selectedVideo = null;
    } else {
      if (!this.ALLOWED_VIDEO_TYPES.includes(file.type)) {
        this.error = 'Type de fichier non autorisé. Veuillez sélectionner une vidéo (MP4, MOV, AVI, MKV, WEBM)';
        return;
      }
      if (file.size > this.MAX_VIDEO_SIZE) {
        this.error = 'La vidéo est trop volumineuse. La taille maximale est de 500MB';
        return;
      }
      this.selectedVideo = file;
      this.selectedImage = null;
    }

    this.uploadedFileName = file.name;

    // Créer une URL pour la prévisualisation si c'est une image
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  onPost() {
    if (!this.postText.trim() && !this.selectedImage && !this.selectedVideo) {
      this.error = 'Veuillez ajouter du texte, une image ou une vidéo';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData = new FormData();
    formData.append('content', this.postText);
    
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Post créé avec succès:', response);
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Erreur lors de la création du post:', error);
        this.error = 'Une erreur est survenue lors de la création du post';
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.postText = '';
    this.selectedImage = null;
    this.selectedVideo = null;
    this.uploadedFileName = null;
    this.previewUrl = null;
    this.error = null;
  }
}
