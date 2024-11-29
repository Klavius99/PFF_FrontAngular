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
import { InfoManagerDashboardComponent } from './Admin/info-manager-dashboard/info-manager-dashboard.component';
import { roleGuard } from './guards/role.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Routes publiques
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forget-password', component: ForgotPasswordComponent },
    
    // Routes protégées par authentification et rôles
    {
        path: 'dashboard',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'default',
                pathMatch: 'full'
            },
            {
                path: 'default',
                component: DashboardComponent,
                canActivate: [roleGuard(['formateur', 'apprenant'])]
            },
            {
                path: 'admin',
                component: AdminDashboardComponent,
                canActivate: [roleGuard(['admin'])]
            },
            {
                path: 'info-manager',
                component: InfoManagerDashboardComponent,
                canActivate: [roleGuard(['info_manager'])]
            }
        ]
    },
    {
        path: 'discussion',
        component: DiscussionComponent,
        canActivate: [authGuard]
    },
    {
        path: 'info&evenement',
        component: InformationComponent,
        canActivate: [authGuard]
    },
    {
        path: 'SearchPage',
        component: SearchPageComponent,
        canActivate: [authGuard]
    },
    {
        path: 'notification',
        component: NotificationComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profil',
        component: ProfilPageComponent,
        canActivate: [authGuard]
    },

    // Route par défaut (404)
    { path: '**', redirectTo: 'login' }
];
