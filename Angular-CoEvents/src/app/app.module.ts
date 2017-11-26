import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PasswordLostComponent } from './password-lost/password-lost.component';
import { ManagerDBModule } from './shared/_services/dbManager.service';
import { AuthGuard } from './shared/_services/auth.service';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventsComponent } from './events/events.component';
import { EventComponent } from './events/event/event.component';
import { MenuDirective } from './menu/menu.directive';
import { routing } from './app.router';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PasswordLostComponent,
    ProfileComponent,
    MenuComponent,
    CalendarComponent,
    EventsComponent,
    EventComponent,
    MenuDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    routing
  ],
  providers: [ManagerDBModule, AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule {
}
