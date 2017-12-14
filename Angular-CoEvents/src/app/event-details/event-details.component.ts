import { Component, HostBinding, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Event } from '../shared/_models/events.model';
import { EventsHandler } from '../shared/_services/eventsHandler.service';
import { ManagerDBModule } from '../shared/_services/dbManager.service';

import { slideToTop } from '../router.animations';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  animations: [slideToTop]
})

export class EventDetailsComponent implements OnInit {

  @HostBinding('@slideToTop') slideToTop;

  private users;
  private date = new Date();
  private today = this.date.getFullYear() +
    '-' + (this.date.getMonth() + 1) +
    '-' + this.date.getUTCDate();

  currentEvent: Event;
  id: string;
  partecipants: object;
  interested: object;
  notGoing: object;

  sameUser: boolean;
  loggedUser: string;
  alreadyPart: boolean;
  alreadyInterested: boolean;
  alreadyNotGoing: boolean;
  eventPathImg: SafeStyle;
  avatarImg: SafeUrl;

  constructor(private managerDB: ManagerDBModule,
              private eventsHandler: EventsHandler,
              private sanitizer: DomSanitizer,
              private router: Router,
              activatedRoute: ActivatedRoute) {

    this.sameUser = false;
    this.alreadyPart = false;
    this.alreadyInterested = false;
    this.alreadyNotGoing = false;

    this.managerDB.getUsers().subscribe(users => {
      this.users = users;
      for (const user in this.users) {
        if (this.users.hasOwnProperty(user)) {
          if (this.users[user].username === this.currentEvent.owner) {
            const avatar = this.users[user].avatar;
            this.avatarImg = this.sanitizer.bypassSecurityTrustUrl(`${avatar}`);
            break;
          }
        }
      }
    });

    const url = activatedRoute.snapshot.params['url'];
    this.managerDB.getSingleEvent(url).subscribe(event => {
      for (const e in event) {
        if (event.hasOwnProperty(e)) {
          this.currentEvent = event[e];
          this.id = e;
        }
      }

      this.eventPathImg = this.sanitizer.bypassSecurityTrustStyle(`url('assets/img/${this.currentEvent.imgPath}')`);

      this.partecipants = this.currentEvent.partecipants;
      this.interested = this.currentEvent.interested;
      this.notGoing = this.currentEvent.notGoing;

      this.loggedUser = this.eventsHandler.getStaticUser();
      this.loggedUser === this.currentEvent.owner ? this.sameUser = true : this.sameUser = false;

      for (const p in this.partecipants) {
        if (this.partecipants.hasOwnProperty(p)) {
          if (this.partecipants[p] === this.loggedUser) {
            this.alreadyPart = true;
          }
        }
      }

      for (const p in this.interested) {
        if (this.interested.hasOwnProperty(p)) {
          if (this.interested[p] === this.loggedUser) {
            this.alreadyInterested = true;
          }
        }
      }

      for (const p in this.notGoing) {
        if (this.notGoing.hasOwnProperty(p)) {
          if (this.notGoing[p] === this.loggedUser) {
            this.alreadyNotGoing = true;
          }
        }
      }
    });
  }

  ngOnInit() { }

  goingToEvent() {
    let newPartecipantsObj = {};
    const newPartecipantsArr = [];

    this.partecipants === [] ? newPartecipantsObj = {} : newPartecipantsObj = this.partecipants;

    if (Object.values(newPartecipantsObj).indexOf(this.loggedUser) === -1) {
      newPartecipantsArr.push(this.loggedUser);
    }

    const obj = newPartecipantsArr.reduce((acc, cur, i) => {
      acc[i] = cur;
      return acc;
    }, {});

    this.managerDB.addPartecipant(this.id, obj).subscribe(arg => console.log(arg));
    alert('Congratulations, you\'ll partecipate to that event\nNow you\'ll be redirected to the dashboard');
    this.router.navigate(['/dashboard']).then();
  }

  interestedToEvent() {
    let interestedPartecipantsObj = {};
    const interestedPartecipantsArr = [];

    this.interested === [] ? interestedPartecipantsObj = {} : interestedPartecipantsObj = this.interested;

    if (Object.values(interestedPartecipantsObj).indexOf(this.loggedUser) === -1) {
      interestedPartecipantsArr.push(this.loggedUser);
    }

    const obj = interestedPartecipantsArr.reduce((acc, cur, i) => {
      acc[i] = cur;
      return acc;
    }, {});

    this.managerDB.addInterested(this.id, obj).subscribe(arg => console.log(arg));
    alert('You\'re interested to this event\n You\'ll be recirected to the dashboard');
    this.router.navigate(['/dashboard']).then();
  }

  notGoingToEvent() {
    let notGoingPartecipantsObj = {};
    const notGoingPartecipantsArr = [];

    this.notGoing === [] ? notGoingPartecipantsObj = {} : notGoingPartecipantsObj = this.notGoing;

    if (Object.values(notGoingPartecipantsObj).indexOf(this.loggedUser) === -1) {
      notGoingPartecipantsArr.push(this.loggedUser);
    }

    const obj = notGoingPartecipantsArr.reduce((acc, cur, i) => {
      acc[i] = cur;
      return acc;
    }, {});

    this.managerDB.addNotGoing(this.id, obj).subscribe(arg => console.log(arg));
    alert('You\'ll not go to the event\nYou\'ll be redirected to the dashboard');
    this.router.navigate(['/dashboard']).then();
  }

  editEvent(event, url) {
    this.eventsHandler.setEditEvent(event);
    this.router.navigate(['/edit-event/', url]).then();
  }

  deleteEvent(id) {
    this.managerDB.deleteEvent(id).subscribe(() => {
      alert('The event was deleted successfully. \n\n You will be redirect to the dashboard');
      this.eventsHandler.setDay(this.today);
      this.router.navigate(['/dashboard']).then();
    });
  }

}
