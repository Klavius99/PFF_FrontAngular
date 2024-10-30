import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  selectedImage: File | null = null;
  selectedVideo: File | null = null;
  uploadedFileName: string | null = null;

  triggerImageUpload() {
    const imageInput = document.getElementById('imageInput') as HTMLInputElement;
    imageInput.click();
  }

  triggerVideoUpload() {
    const videoInput = document.getElementById('videoInput') as HTMLInputElement;
    videoInput.click();
  }

  onFilePicked(event: Event, fileType: string) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      this.uploadedFileName = file.name; // Affiche le nom du fichier sélectionné

      if (fileType === 'image') {
        this.selectedImage = file;
      } else if (fileType === 'video') {
        this.selectedVideo = file;
      }
    }
  }

  onPost() {
    // Logique pour poster avec l'image et/ou la vidéo sélectionnée
    console.log('Post envoyé avec le fichier :', this.uploadedFileName);
  }
}
