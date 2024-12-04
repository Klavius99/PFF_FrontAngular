import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { PostComponent } from "../../shared/posts/post/post.component";
import { PostListComponent } from "../../shared/posts/post-list/post-list.component";
import { CreatePostComponent } from "../../shared/posts/create-post/create-post.component";
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, PostComponent, PostListComponent, CreatePostComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.loading = true;
    this.error = null;
    
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('User loaded:', user);
        this.currentUser = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        this.error = 'Erreur lors de la récupération des données utilisateur';
        this.loading = false;
      }
    });
  }
}
