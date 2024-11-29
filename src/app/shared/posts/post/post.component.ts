import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  selectedImage: File | null = null;
  selectedVideo: File | null = null;
  uploadedFileName: string | null = null;
  postText: string = '';
  isSubmitting = false;
  previewUrl: string | null = null;

  constructor(private postService: PostService) {}

  // Méthodes pour déclencher l'upload des fichiers
  triggerImageUpload() {
    const imageInput = document.getElementById('imageInput') as HTMLInputElement;
    imageInput.click();
  }

  triggerVideoUpload() {
    const videoInput = document.getElementById('videoInput') as HTMLInputElement;
    videoInput.click();
  }

  // Gestion de la sélection de fichier
  onFilePicked(event: Event, fileType: string) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      // Vérifie le type de fichier
      if ((fileType === 'image' && !file.type.startsWith('image')) ||
          (fileType === 'video' && !file.type.startsWith('video'))) {
        alert(`Veuillez sélectionner un fichier ${fileType} valide.`);
        return;
      }

      this.uploadedFileName = file.name;

      if (fileType === 'image') {
        this.selectedImage = file;
        this.selectedVideo = null; // Réinitialise la vidéo si une image est sélectionnée
        
        // Ajouter la prévisualisation de l'image
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else if (fileType === 'video') {
        this.selectedVideo = file;
        this.selectedImage = null; // Réinitialise l'image si une vidéo est sélectionnée
        this.previewUrl = null;
      }
    }
  }

  // Méthode pour publier le post
  onPost() {
    if (this.isSubmitting) return;
    if (!this.postText && !this.selectedImage && !this.selectedVideo) {
      alert("Le post doit contenir du texte, une image ou une vidéo.");
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('content', this.postText.trim());
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

    console.log('Envoi du post...');
    console.log('Contenu:', this.postText);
    console.log('Image:', this.selectedImage);
    console.log('Vidéo:', this.selectedVideo);

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Post publié avec succès', response);
        this.resetForm();
        this.isSubmitting = false;
        window.dispatchEvent(new CustomEvent('postCreated'));
      },
      error: (error) => {
        console.error('Erreur lors de la création du post:', error);
        let errorMessage = 'Une erreur est survenue lors de la publication du post';
        
        if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet et que le serveur est en cours d\'exécution.';
        } else if (error.status === 500) {
          errorMessage = 'Une erreur serveur est survenue. Veuillez réessayer plus tard.';
        } else if (error.status === 422 && error.error) {
          if (error.error.errors) {
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage = validationErrors.join('\n');
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        } else if (error.status === 401) {
          errorMessage = 'Vous devez être connecté pour publier un post';
          // Rediriger vers la page de connexion si nécessaire
        }
        
        alert(errorMessage);
        this.isSubmitting = false;
      }
    });
  }

  // Réinitialisation du formulaire
  resetForm() {
    this.postText = '';
    this.selectedImage = null;
    this.selectedVideo = null;
    this.uploadedFileName = null;
    this.previewUrl = null;
  }
}
