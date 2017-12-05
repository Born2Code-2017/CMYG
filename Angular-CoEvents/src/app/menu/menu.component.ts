import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsHandler } from '../shared/_services/eventsHandler.service';
import { slideToRight } from '../router.animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [slideToRight]
})
export class MenuComponent implements OnInit {

  @HostBinding('@slideToRight') slideToRight;

  loggedUser: string;
  hambClicked: boolean;
  isActive: number;

  constructor(private router: Router,
              private eventsHandler: EventsHandler) {
    this.hambClicked = false;
  }

  ngOnInit() {
    this.loggedUser = 'Welcome ' + this.eventsHandler.getStaticUser();
  }

  openMenuMobile() {
    !this.hambClicked ? this.hambClicked = true : this.hambClicked = false;
  }

  doLogOut() {
    sessionStorage.removeItem('loggedUser');
    localStorage.removeItem('loggedUser');
    this.eventsHandler.setUser(undefined);

    this.router.navigate(['/login']).then();
  }

}
