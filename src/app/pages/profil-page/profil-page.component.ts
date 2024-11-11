import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { RouterModule } from '@angular/router';
import { SocialPostComponent } from "../social-post/social-post.component";

@Component({
  selector: 'app-profil-page',
  standalone: true,
  imports: [NavbarComponent, RouterModule, SocialPostComponent],
  templateUrl: './profil-page.component.html',
  styleUrl: './profil-page.component.css'
})
export class ProfilPageComponent {
  email: string='exemple@isepdiamniadio.edu.sn';
}
