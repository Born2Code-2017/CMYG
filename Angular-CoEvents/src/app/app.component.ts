import { Component, OnInit } from '@angular/core';
import { EventsHandler } from './shared/_services/eventsHandler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  loggedUser: string;

  constructor(private eventsHandler: EventsHandler) { }

  ngOnInit() {
    const tmpUser = sessionStorage.getItem('loggedUser') || localStorage.getItem('loggedUser');

    if (tmpUser) {
      const JSONUser = JSON.parse(tmpUser);
      this.loggedUser = JSONUser.username;
      this.eventsHandler.setStaticUser(JSONUser.username);
    }

    this.eventsHandler.getUser().subscribe(user => this.loggedUser = user);
  }
}
