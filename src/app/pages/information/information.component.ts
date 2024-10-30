import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {
messages: any;

}
