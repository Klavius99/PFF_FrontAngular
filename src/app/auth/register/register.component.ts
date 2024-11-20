import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css' 
})

export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // Initialisation du formulaire avec validation
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@isepdiamniadio.edu.sn$') // Vérification email ISEP
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Méthode pour gérer la soumission du formulaire
  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const { username, email, password } = this.registerForm.value;

    this.http.post('http://localhost:8000/api/register', { username, email, password })
      .subscribe({
        next: () => {
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
          this.router.navigate(['/login']); // Redirige vers la page de connexion
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = err.error.message || 'Une erreur est survenue.';
          } else {
            this.errorMessage = 'Erreur interne du serveur. Réessayez plus tard.';
          }
        }
      });
  }
} 