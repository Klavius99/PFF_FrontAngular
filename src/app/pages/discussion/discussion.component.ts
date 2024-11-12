import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { AppComponent } from '../../app.component';
import { CommonModule } from '@angular/common';
import { MessageLayoutComponent } from "../../shared/message-layout/message-layout.component";
import { UsersDiscussionListComponent } from "../../shared/users-discussion-list/users-discussion-list.component";
import { GroupsDiscussionListComponent } from '../../shared/groups-discussion-list/groups-discussion-list.component';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [NavbarComponent, CommonModule, MessageLayoutComponent, UsersDiscussionListComponent, GroupsDiscussionListComponent],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css'
})
export class DiscussionComponent {
  selectedView: 'users' | 'groups' = 'users'; // Définit 'users' comme vue par défaut

  // Méthodes pour changer la vue
  showUsers() {
    this.selectedView = 'users';
  }

  showGroups() {
    this.selectedView = 'groups';
  }
}
