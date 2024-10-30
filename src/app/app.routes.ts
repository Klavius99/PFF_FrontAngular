import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DiscussionComponent } from './pages/discussion/discussion.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { InformationComponent } from './pages/information/information.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ParametresComponent } from './pages/parametres/parametres.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
  //{ path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection vers login par défaut

    { path: 'dashboard', component: DashboardComponent },
    { path: 'discussion', component: DiscussionComponent},
    { path: 'info&evenement', component: InformationComponent },
    
    { path: 'SearchPage', component: SearchPageComponent }, 
    
    { path: 'profil', component: ProfilPageComponent }, 
    
    { path: 'notification', component: NotificationComponent }, 

];
