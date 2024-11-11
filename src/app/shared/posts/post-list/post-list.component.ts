import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  likeA: number = 0;
  islike: boolean = false;

  OnLike(): void {
    if (this.islike) {
      this.likeA--;
    } else {
      this.likeA++;
    }
    this.islike = !this.islike;
  }

}

