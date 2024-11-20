import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DiscussionComponent } from './pages/discussion/discussion.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { InformationComponent } from './pages/information/information.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' }, // Redirection par défaut
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forget-password', component: ForgotPasswordComponent },
    

    {path : 'dashboard-admin', component: AdminDashboardComponent},

    { path: 'dashboard', component: DashboardComponent },
    { path: 'discussion', component: DiscussionComponent},
    { path: 'info&evenement', component: InformationComponent },
    
    { path: 'SearchPage', component: SearchPageComponent }, 
    
    { path: 'profil', component: ProfilPageComponent }, 
    
    { path: 'notification', component: NotificationComponent },

];
