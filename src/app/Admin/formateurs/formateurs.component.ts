import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formateurs.component.html',
  styleUrls: ['./formateurs.component.css']
})
export class FormateursComponent {
  formateurs = [
    { id: 1, nom: 'Cherif Ndiaye', email: 'C.ndiaye4@isepdiamniadio.edu.sn', groupeResponsable: '' },
    { id: 2, nom: 'Abdoulaye Mbaye', email: 'A.mbaye4@isepdiamniadio.edu.sn', groupeResponsable: '' },
    { id: 3, nom: 'Sidibe', email: 'S.sidibe4@isepdiamniadio.edu.sn', groupeResponsable: '' },
    { id: 4, nom: 'Birane Koundoul', email: 'B.koundoul4@isepdiamniadio.edu.sn', groupeResponsable: '' },
  ];

  groupes = [
    { id: 1, nom: 'DFE' },
    { id: 2, nom: 'DBE' },
    { id: 3, nom: 'ABD' },
    { id: 4, nom: 'APD' },
    { id: 5, nom: 'ASSC' },
  ];
}