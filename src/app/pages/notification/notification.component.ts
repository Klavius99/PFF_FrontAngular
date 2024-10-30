import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  playSound() {
    let audio = new Audio();
    audio.src = "assets/sounds/trailer.mp3";
    audio.load();
    audio.play();
  }
}
