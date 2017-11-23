import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PasswordLostComponent } from './password-lost/password-lost.component';
import { ManagerDBModule } from './shared/_services/dbManager.service';
import { AuthGuard } from './shared/_services/auth.service';
import { external_routing } from './app.router';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PasswordLostComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    external_routing
  ],
  providers: [ManagerDBModule, AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule {
}
