import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { AppComponent } from '../../app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css'
})
export class DiscussionComponent {
    
}
