import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

interface Notification {
  id: number;
  type: string;
  content: string;
  date: Date;
  read: boolean;
}

@Component({
  selector: 'app-profil-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './profil-page.component.html',
  styleUrls: ['./profil-page.component.css']
})
export class ProfilPageComponent implements OnInit {
  // Informations personnelles
  userName: string = '';
  profession: string = '';
  level: string = '';
  email: string = '';
  dateNaissance: string = '';
  lieuNaissance: string = '';
  telephone: string = '';
  adresse: string = '';

  // Informations académiques
  parcours = {
    universite: "",
    departement: '',
    specialisation: '',
    anneeEntree: '',
    promotion: '',
    moyenne: ''
  };

  competences = [
    { categorie: 'Langages', items: [] },
    { categorie: 'Frameworks', items: [] },
    { categorie: 'Base de données', items: [] },
    { categorie: 'Outils', items: [] }
  ];

  activites = [
    { type: '', nom: '', role: '' },
    { type: '', nom: '', role: '' },
    { type: '', nom: '', role: '' }
  ];

  certifications = [
    { nom: '', date: '', organisme: '' },
    { nom: '', date: '', organisme: '' },
    { nom: '', date: '', organisme: '' }
  ];

  stages = [
    {
      entreprise: '',
      poste: '',
      periode: '',
      description: ""
    },
    {
      entreprise: '',
      poste: '',
      periode: '',
      description: ""
    }
  ];

  activeSection: string = 'apropos';
  notifications: Notification[] = [
    {
      id: 1,
      type: 'info',
      content: 'Nouvelle mise à jour du système académique disponible',
      date: new Date('2024-01-15'),
      read: false
    },
    {
      id: 2,
      type: 'success',
      content: 'Votre demande de stage a été approuvée',
      date: new Date('2024-01-14'),
      read: true
    },
    {
      id: 3,
      type: 'warning',
      content: 'Rappel : Remise du rapport de projet le 20 janvier',
      date: new Date('2024-01-13'),
      read: false
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    // Récupérer l'ID de l'URL
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        // Si un ID est fourni, charger les informations de cet utilisateur
        this.loadUserProfile(userId);
      } else {
        // Si pas d'ID, charger le profil de l'utilisateur connecté
        this.loadCurrentUserProfile();
      }
    });
  }

  private loadUserProfile(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.updateProfileInfo(user);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
      }
    });
  }

  private loadCurrentUserProfile() {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.updateProfileInfo(user);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
      }
    });
  }

  private updateProfileInfo(user: User) {
    this.userName = user.username;
    this.profession = user.role || '';
    this.email = user.email || '';
    // Mettre à jour les autres champs en fonction des données disponibles
  }

  changeSection(section: string) {
    this.activeSection = section;
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markNotificationAsRead(notification: Notification) {
    notification.read = true;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'fa-check-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'error': return 'fa-times-circle';
      default: return 'fa-info-circle';
    }
  }
}
