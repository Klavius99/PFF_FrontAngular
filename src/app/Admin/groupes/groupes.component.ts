import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';

@Component({
  selector: 'app-groupes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './groupes.component.html',
  styleUrls: ['./groupes.component.css']
})
export class GroupesComponent {
  groupes = [
    { id: 1, nom: 'DFE', nombreMembres: 30 },
    { id: 2, nom: 'DBE', nombreMembres: 28 },
    { id: 3, nom: 'ABD', nombreMembres: 25 },
    { id: 4, nom: 'APD', nombreMembres: 35 },
    { id: 5, nom: 'ASSC', nombreMembres: 22 },
  ];
}
