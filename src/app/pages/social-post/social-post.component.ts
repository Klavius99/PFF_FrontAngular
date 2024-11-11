import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post, CreatePostDto } from '../../models/post';
import { PostService } from '../../services/post.service';
import { PostListComponent } from '../../shared/post-list/post-list.component';


@Component({
  selector: 'app-social-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PostListComponent],
  templateUrl: './social-post.component.html',
  styleUrls: ['./social-post.component.css']
})
export class SocialPostComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isImage: boolean = false;
  isVideo: boolean = false;
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  errorMessage: string | null = null;
  posts: Post[] = [];

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.postForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(280)]],
    });
  }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewFile();
    }
  }

  previewFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.isImage = this.selectedFile!.type.startsWith('image/');
        this.isVideo = this.selectedFile!.type.startsWith('video/');
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.errorMessage = null;

      const postData: CreatePostDto = {
        text: this.postForm.get('text')?.value,
        image: this.selectedFile || undefined
      };

      this.postService.createPost(postData).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.resetForm();
          this.loadPosts(); // Reload posts after successful submission
        },
        error: (error) => {
          console.error('Error creating post:', error);
          this.isSubmitting = false;
          this.errorMessage = 'An error occurred while creating the post. Please try again.';
        }
      });
    }
  }

  resetForm() {
    this.postForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
    this.isImage = false;
    this.isVideo = false;
  }
}