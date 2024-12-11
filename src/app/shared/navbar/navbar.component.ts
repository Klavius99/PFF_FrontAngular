import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchbarComponent, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  userPhoto: string = 'assets/images/weuz.jpg';
  isMenuOpen = false;
  userRole: string = '';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // S'abonner aux changements d'état de connexion
    this.authService.currentUser$.subscribe(
      (user) => {
        if (user) {
          this.loadUserData();
        }
      }
    );

    // Charger les données utilisateur si déjà connecté
    if (this.authService.getCurrentUser()) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.username || 'Utilisateur';
        this.userRole = user.role || 'apprenant';
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  navigateToDashboard() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    switch(this.userRole) {
      case 'admin':
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'info_manager':
        this.router.navigate(['/dashboard/info-manager']);
        break;
      case 'formateur':
      case 'apprenant':
        this.router.navigate(['/dashboard/default']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }

  toggleMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileMenu = (event.target as HTMLElement).closest('.profile-menu');
    if (!profileMenu) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.userName = '';
        this.userRole = '';
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        // En cas d'erreur, on déconnecte quand même côté client
        this.userName = '';
        this.userRole = '';
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
    });
  }
}
