import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  likeA: number = 0;
  islike: boolean = false;
posts: any;

  OnLike(): void {
    if (this.islike) {
      this.likeA--;
    } else {
      this.likeA++;
    }
    this.islike = !this.islike;
  }

}

