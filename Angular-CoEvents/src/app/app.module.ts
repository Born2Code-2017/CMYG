import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ManagerDBModule } from './shared/_services/dbManager.service';
import { AuthGuard } from './shared/_services/auth.service';
import { EventsHandler } from './shared/_services/eventsHandler.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PasswordLostComponent } from './password-lost/password-lost.component';
import { MenuComponent } from './menu/menu.component';
import { MenuDirective } from './menu/menu.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventsComponent } from './events/events.component';
import { EventComponent } from './events/event/event.component';
import { ProfileComponent } from './profile/profile.component';
import { routing } from './app.router';
import { CategoryDirective } from './dashboard/category.directive';
import { TimePipe } from './shared/_pipe/time.pipe';


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
    MenuDirective,
    CategoryDirective,
    TimePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    routing
  ],
  providers: [
    ManagerDBModule,
    AuthGuard,
    EventsHandler
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
