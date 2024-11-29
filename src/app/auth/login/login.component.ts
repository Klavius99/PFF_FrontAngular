import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Redirection selon le rôle
        switch (response.user.role) {
          case 'super_admin':
            this.router.navigate(['/super-admin']);
            break;
          case 'admin':
            this.router.navigate(['/dashboard-admin']);
            break;
          case 'info_manager':
            this.router.navigate(['/dashboard-info']);
            break;
          case 'formateur':
          case 'apprenant':
            this.router.navigate(['/dashboard']);
            break;
          default:
            this.errorMessage = 'Rôle non reconnu';
            break;
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la connexion';
        }
      }
    });
  }
}
