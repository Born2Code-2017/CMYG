import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerDBModule } from '../shared/_services/dbManager.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private users;
  private username: string;
  private password: string;
  private checkbox: boolean;
  private wrongCredentials: string;
  error_label_user: number;
  error_label_pass: number;
  lblUser: number;
  lblPass: number;

  constructor(private managerDB: ManagerDBModule,
              private router: Router) {
    this.username = '';
    this.password = '';
    this.wrongCredentials = '';
    this.error_label_user = 0;
    this.error_label_pass = 0;
    this.lblUser = 0;
    this.lblPass = 0;
    this.checkbox = false;
  }

  ngOnInit() {
    this.managerDB.getUsers().subscribe(
      arg => this.users = arg,
      err => console.log('Error downloading from Firebase')
    );
  }

  labelMove() {
    this.username.length >= 1 ? this.lblUser = 1 : this.lblUser = 0;
    this.password.length >= 1 ? this.lblPass = 1 : this.lblPass = 0;
  }

  doLogin() {
    for (const u of this.users) {
      if (this.username === u.username || this.username === u.email) {
        this.error_label_user = 0;
        if (this.password === u.password) {
          this.error_label_pass = 0;
          this.checkbox === false ?
            sessionStorage.setItem('loggedUser', JSON.stringify(u)) :
            localStorage.setItem('loggedUser', JSON.stringify(u));
          this.router.navigateByUrl('/dashboard').then();
          break;
        } else {
          this.error_label_pass = 1;
          this.wrongCredentials = 'Wrong Password!';
        }
        break;
      } else {
        this.error_label_user = 1;
        this.error_label_pass = 1;
        this.wrongCredentials = 'Wrong Credentials!';
      }
    }
  }
}
