import { Injectable } from '@angular/core';

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {
  checkStrength(password: string): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];

    if (!password) {
      return { score: 0, feedback: 'Veuillez entrer un mot de passe', color: 'gray' };
    }

    // Longueur minimum
    if (password.length >= 8) {
      score++;
      feedback.push('Longueur suffisante');
    } else {
      feedback.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    // Présence de lettres minuscules
    if (/[a-z]/.test(password)) {
      score++;
      feedback.push('Contient des lettres minuscules');
    }

    // Présence de lettres majuscules
    if (/[A-Z]/.test(password)) {
      score++;
      feedback.push('Contient des lettres majuscules');
    }

    // Présence de chiffres
    if (/\d/.test(password)) {
      score++;
      feedback.push('Contient des chiffres');
    }

    // Présence de caractères spéciaux
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score++;
      feedback.push('Contient des caractères spéciaux');
    }

    // Déterminer la couleur en fonction du score
    let color: string;
    switch (score) {
      case 0:
      case 1:
        color = 'red';
        break;
      case 2:
        color = 'orange';
        break;
      case 3:
        color = 'yellow';
        break;
      case 4:
        color = 'blue';
        break;
      case 5:
        color = 'green';
        break;
      default:
        color = 'gray';
    }

    return {
      score,
      feedback: feedback.join(', '),
      color
    };
  }
}
