import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiliereService } from '../../services/filiere.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { app } from '../../../../server';
import { FormateursComponent } from "../formateurs/formateurs.component";
import { GroupesComponent } from "../groupes/groupes.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormateursComponent, GroupesComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent {
 
  filieres = [
    { id: 1, nom: 'DFE' },
    { id: 2, nom: 'DBE' },
    { id: 3, nom: 'ABD' },
    { id: 4, nom: 'APD' },
    { id: 5, nom: 'ASSC' },
  ];
  promos = [
    { id: 1, nom: 'Promo 4' },
    { id: 2, nom: 'Promo 5' },
    { id: 2, nom: 'Promo 6' },
  ];
  
  formateur = {
    prenom: '',
    nom: '',
    email: ''
  };

  groupe = {
    nomGroupe: '',
    filiereId: ''
  };

  activeMenu: string = 'dashboard';

  constructor(private authService: AuthService, private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadFilieres();
  }

  loadFilieres(): void {
    this.adminService.getFilieres().subscribe(
      (data) => {
        this.filieres = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des filières', error);
      }
    );
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        // En cas d'erreur, on déconnecte quand même côté client
        
        this.router.navigate(['/login']);
      }
    });
  }

  onAddFormateur(): void {
    this.adminService.addFormateur(this.formateur).subscribe(
      response => {
        console.log('Formateur ajouté avec succès', response);
        // Réinitialiser le formulaire ou effectuer d'autres actions
        this.formateur = { prenom: '', nom: '', email: '' };
      },
      error => {
        console.error('Erreur lors de l\'ajout du formateur', error);
      }
    );
  }

  onAddGroupe(): void {
    const groupeData = { nomGroupe: this.groupe.nomGroupe, filiereId: this.groupe.filiereId };
    
    this.adminService.addGroupe(groupeData).subscribe(
      response => {
        console.log('Groupe créé avec succès', response);
        // Réinitialiser le formulaire ou effectuer d'autres actions
        this.groupe = { nomGroupe: '', filiereId: '' };
      },
      error => {
        console.error('Erreur lors de la création du groupe', error);
      }
    );
  }

  isActive(menu: string): boolean {
    return this.activeMenu === menu;
  }

  setActive(menu: string): void {
    this.activeMenu = menu;
  }
}