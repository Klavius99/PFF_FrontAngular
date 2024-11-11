import { Component, HostListener } from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchbarComponent,RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userName: string = 'Mbaye Diop'; // Remplacez par le vrai nom de l'utilisateur
userPhoto: any;

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }



  isMenuOpen = false; // État du sous-menu

  // Fonction pour basculer l'état du menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
