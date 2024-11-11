import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  selectedImage: File | null = null;
  selectedVideo: File | null = null;
  uploadedFileName: string | null = null;
  postText: string = ''; // Pour gérer le texte du post

  constructor(private http: HttpClient) {}

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
      } else if (fileType === 'video') {
        this.selectedVideo = file;
        this.selectedImage = null; // Réinitialise l'image si une vidéo est sélectionnée
      }
    }
  }

  // Méthode pour publier le post
  onPost() {
    if (!this.postText && !this.selectedImage && !this.selectedVideo) {
      alert("Le post doit contenir du texte, une image ou une vidéo.");
      return;
    }

    const formData = new FormData();
    formData.append('text', this.postText);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

    // Envoi de la requête POST vers l'API Laravel
    this.http.post('http://localhost:8000/api/posts', formData).subscribe(
      response => {
        console.log('Post publié avec succès', response);
        this.resetForm(); // Réinitialiser le formulaire après la soumission
      },
      error => {
        console.error('Erreur lors de la publication du post', error);
      }
    );
  }

  // Réinitialise le formulaire après l'envoi du post
  resetForm() {
    this.postText = '';
    this.uploadedFileName = null;
    this.selectedImage = null;
    this.selectedVideo = null;
  }
}
