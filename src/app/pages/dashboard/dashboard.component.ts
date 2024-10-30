import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { PostComponent } from "../../shared/posts/post/post.component";
import { PostListComponent } from "../../shared/posts/post-list/post-list.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, PostComponent, PostListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
[x: string]: any;
  userName: string = 'Mbaye Diop';
  profession: string = 'Administrateur Systeme';
  userRole: String = 'Formateur';
}
