import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="post-list">
      <h3 class="text-xl font-bold mb-4">Recent Posts</h3>
      <div *ngFor="let post of posts" class="post-item mb-4 p-4 bg-white rounded-lg shadow">
        <p class="mb-2">{{ post.text }}</p>
        <img *ngIf="post.image_url" [src]="post.image_url" alt="Post image" class="max-w-full h-auto rounded-lg mb-2">
        <small class="text-gray-500">Posted on: {{ post.created_at | date:'medium' }}</small>
      </div>
    </div>
  `,
  styles: [`
    .post-list {
      margin-top: 2rem;
    }
    .post-item {
      border: 1px solid #e2e8f0;
    }
  `]
})
export class PostListComponent {
  @Input() posts: Post[] = [];
}