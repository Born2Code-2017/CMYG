import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerDBModule } from '../shared/_services/dbManager.service';

@Component({
  selector: 'app-password-lost',
  templateUrl: './password-lost.component.html',
  styleUrls: ['./password-lost.component.css']
})

export class PasswordLostComponent implements OnInit {

  users;
  email: string;
  wrongUser: string;
  error_label_user: number;
  lblUser: number;

  constructor(private managerDB: ManagerDBModule,
              private router: Router) {
    this.email = '';
    this.wrongUser = '';
    this.lblUser = 0;
    this.error_label_user = 0;
  }

  ngOnInit() {
    this.managerDB.getUsers().subscribe(
      arg => this.users = arg,
      err => console.log('Error downloading users from Firebase')
    );
  }

  labelMove() {
    this.email.length >= 1 ? this.lblUser = 1 : this.lblUser = 0;
  }

  restorePwd() {
    for (const u of this.users) {
      if (this.email === u.email) {
        this.error_label_user = 0;
        alert('We\'ve sent you an email with a temporary password');
        this.router.navigateByUrl('/login').then();
        break;
      } else {
        this.error_label_user = 1;
        this.wrongUser = 'This email doesnt\'s exist in our database';
      }
    }
  }
}
