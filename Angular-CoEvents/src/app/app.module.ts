import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ManagerDBModule } from './shared/_services/dbManager.service';
import { EventsHandler } from './shared/_services/eventsHandler.service';
import { AuthGuard } from './shared/_services/auth.service';
import { NewEventGuard } from './shared/_services/eventGuard.service';

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
import { NewEventComponent } from './new-event/new-event.component';
import { HeaderComponent } from './header/header.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

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
    TimePipe,
    NewEventComponent,
    HeaderComponent,
    EventDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgxMyDatePickerModule.forRoot(),
    routing
  ],
  providers: [
    ManagerDBModule,
    EventsHandler,
    AuthGuard,
    NewEventGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
