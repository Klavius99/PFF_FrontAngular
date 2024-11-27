import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  userRole: string = '';
  userName: string = '';
  private userSubscription?: Subscription;
  
  adminForm: FormGroup;
  infoManagerForm: FormGroup;
  
  successMessage: string = '';
  errorMessage: string = '';
  
  totalUsers: number = 0;
  totalFormateurs: number = 0;
  totalApprenants: number = 0;
  totalAdmins: number = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.infoManagerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (user: User | null) => {
        if (user) {
          this.userRole = user.role || '';
          this.userName = user.username;
          this.loadStatistics();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  isSuperAdmin(): boolean {
    return this.userRole === 'super_admin';
  }

  onCreateAdmin() {
    if (this.adminForm.valid) {
      const adminData = {
        username: this.adminForm.get('username')?.value,
        email: this.adminForm.get('email')?.value,
        password: this.adminForm.get('password')?.value,
        role: 'admin'
      };

      this.userService.createAdmin(adminData).subscribe({
        next: (response) => {
          this.successMessage = 'Administrateur créé avec succès !';
          this.errorMessage = '';
          this.adminForm.reset();
          this.loadStatistics();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création de l\'administrateur';
          this.successMessage = '';
          console.error('Erreur:', error);
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  onCreateInfoManager() {
    if (this.infoManagerForm.valid) {
      const infoManagerData = {
        username: this.infoManagerForm.get('username')?.value,
        email: this.infoManagerForm.get('email')?.value,
        password: this.infoManagerForm.get('password')?.value,
        role: 'info_manager'
      };

      this.userService.createInfoManager(infoManagerData).subscribe({
        next: (response) => {
          this.successMessage = 'Gestionnaire d\'informations créé avec succès !';
          this.errorMessage = '';
          this.infoManagerForm.reset();
          this.loadStatistics();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création du gestionnaire d\'informations';
          this.successMessage = '';
          console.error('Erreur:', error);
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      }
    });
  }

  loadStatistics() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        this.totalFormateurs = users.filter(u => u.role === 'formateur').length;
        this.totalApprenants = users.filter(u => u.role === 'apprenant').length;
        this.totalAdmins = users.filter(u => u.role === 'admin').length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }
}
