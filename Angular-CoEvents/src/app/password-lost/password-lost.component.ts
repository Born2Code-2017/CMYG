import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { slideToTop } from '../router.animations';

@Component({
  selector: 'app-password-lost',
  templateUrl: './password-lost.component.html',
  styleUrls: ['./password-lost.component.css'],
  animations: [slideToTop]
})

export class PasswordLostComponent implements OnInit {

  @HostBinding('@slideToTop') slideToTop;

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
      err => console.log('Error downloading users from Firebase ', err.status)
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
