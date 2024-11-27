import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@isepdiamniadio.edu.sn$')
      ]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Veuillez entrer une adresse email valide.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.successMessage = 'Un email de réinitialisation a été envoyé à votre adresse.';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }
}
