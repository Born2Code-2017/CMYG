import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsHandler } from '../shared/_services/eventsHandler.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, AfterContentInit {

  loggedUser: string;
  hambClicked: boolean;
  isActive: number;

  constructor(private router: Router,
              private eventsHandler: EventsHandler) {
    this.hambClicked = false;
  }

  ngOnInit() { }

  ngAfterContentInit() {
    if (sessionStorage.getItem('loggedUser')) {
      const JSONUser = JSON.parse(sessionStorage.getItem('loggedUser'));
      this.loggedUser = 'Welcome ' + JSONUser.username;
      this.eventsHandler.setUser(JSONUser.username);
    } else {
      const JSONUser = JSON.parse(localStorage.getItem('loggedUser'));
      this.loggedUser = 'Welcome ' + JSONUser.username;
      this.eventsHandler.setUser(JSONUser.username);
    }
  }

  openMenuMobile() {
    !this.hambClicked ? this.hambClicked = true : this.hambClicked = false;
  }

  doLogOut() {
    sessionStorage.removeItem('loggedUser');
    localStorage.removeItem('loggedUser');
    this.router.navigateByUrl('/login').then(() => {
      sessionStorage.removeItem('loggedUser');
      localStorage.removeItem('loggedUser');
    });
  }

}
