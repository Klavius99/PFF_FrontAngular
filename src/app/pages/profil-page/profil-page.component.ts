import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

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
export class ProfilPageComponent {
  // Informations personnelles
  userName: string = 'Weuz Dieye';
  profession: string = 'Developpeur front end';
  level: string = 'Licence 2';
  email: string = 'o.dieye4@isepdiamniadio.edu.sn';
  dateNaissance: string = '15 Mars 1990';
  lieuNaissance: string = 'Dakar, Sénégal';
  telephone: string = '+221 77 123 45 67';
  adresse: string = 'Keur Massar, Dakar';

  // Informations académiques
  parcours = {
    universite: "Institut Supérieur d'Enseignement Professionnel",
    departement: 'Génie Informatique et Télécommunications',
    specialisation: 'Développement Web et Mobile',
    anneeEntree: '2020',
    promotion: '2024',
    moyenne: '16.5/20'
  };

  competences = [
    { categorie: 'Langages', items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'PHP'] },
    { categorie: 'Frameworks', items: ['Angular', 'Spring Boot', 'Laravel', 'React'] },
    { categorie: 'Base de données', items: ['MySQL', 'PostgreSQL', 'MongoDB'] },
    { categorie: 'Outils', items: ['Git', 'Docker', 'Jenkins', 'Jira'] }
  ];

  activites = [
    { type: 'Club', nom: 'Club Informatique ISEP', role: 'Président' },
    { type: 'Association', nom: 'Association des Étudiants en Génie Logiciel', role: 'Membre actif' },
    { type: 'Projet', nom: 'Système de Gestion Académique', role: 'Chef de projet' }
  ];

  certifications = [
    { nom: 'AWS Certified Developer', date: '2023', organisme: 'Amazon Web Services' },
    { nom: 'Angular Advanced', date: '2023', organisme: 'Google' },
    { nom: 'Scrum Master', date: '2022', organisme: 'Scrum.org' }
  ];

  stages = [
    {
      entreprise: 'Orange Digital Center',
      poste: 'Développeur Full Stack',
      periode: 'Juin - Septembre 2023',
      description: "Développement d'une plateforme de gestion de projets innovants"
    },
    {
      entreprise: 'Sonatel Academy',
      poste: 'Développeur Frontend',
      periode: 'Juillet - Août 2022',
      description: "Création d'interfaces utilisateur pour applications web"
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
