import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private loggedUser: string;

  constructor(private router: Router) { }

  ngOnInit() {
    if (sessionStorage.getItem('loggedUser')) {
      const JSONUser = JSON.parse(sessionStorage.getItem('loggedUser'));
      this.loggedUser = 'Welcome ' + JSONUser.username;
    } else {
      const JSONUser = JSON.parse(localStorage.getItem('loggedUser'));
      this.loggedUser = 'Welcome ' + JSONUser.username;
    }
  }

  doLogOut() {
    sessionStorage.removeItem('loggedUser');
    localStorage.removeItem('loggedUser');
    this.router.navigateByUrl('/login').then();
  }

}
