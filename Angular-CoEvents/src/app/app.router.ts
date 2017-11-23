import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PasswordLostComponent } from './password-lost/password-lost.component';
import { AuthGuard } from './shared/_services/auth.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'password-lost',
    component: PasswordLostComponent
  }
];

export const external_routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
