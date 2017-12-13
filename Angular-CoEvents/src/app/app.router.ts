import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PasswordLostComponent } from './password-lost/password-lost.component';
import { AuthGuard } from './shared/_services/auth.service';
import { NewEventGuard } from './shared/_services/eventGuard.service';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { NewEventComponent } from './new-event/new-event.component';
import { EventDetailsComponent } from './event-details/event-details.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'password-lost',
    component: PasswordLostComponent
  }, {
    path: 'profile',
    component: ProfileComponent
  }, {
    path: 'new-event',
    component: NewEventComponent,
    canDeactivate: [NewEventGuard]
  }, {
    path: 'edit-event/:url',
    component: NewEventComponent,
    canDeactivate: [NewEventGuard]
  }, {
    path: 'event/:url',
    component: EventDetailsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
