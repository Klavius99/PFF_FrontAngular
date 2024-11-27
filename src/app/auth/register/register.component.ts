import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PasswordStrengthService, PasswordStrength } from '../../services/password-strength.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  passwordStrength: PasswordStrength = {
    score: 0,
    feedback: '',
    color: 'gray'
  };
  isPasswordFocused: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private passwordStrengthService: PasswordStrengthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@isepdiamniadio.edu.sn$')
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Observer les changements du mot de passe
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.passwordStrength = this.passwordStrengthService.checkStrength(password);
    });
  }

  getProgressWidth(): string {
    return `${(this.passwordStrength.score / 5) * 100}%`;
  }

  getProgressColorClass(): string {
    switch (this.passwordStrength.color) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    if (this.passwordStrength.score < 3) {
      this.errorMessage = 'Veuillez choisir un mot de passe plus fort.';
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = 'Cette adresse email est déjà utilisée.';
        } else if (err.status === 400) {
          this.errorMessage = 'Les données fournies sont invalides.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription.';
        }
      }
    });
  }
}