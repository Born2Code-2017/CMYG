import { Component, HostBinding, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Event } from '../shared/_models/events.model';
import { EventsHandler } from '../shared/_services/eventsHandler.service';
import { ManagerDBModule } from '../shared/_services/dbManager.service';

import { slideToTop } from '../router.animations';
import * as lodash from 'lodash';

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
  nPartecipants: number;
  interested: object;
  nInterested: number;
  notGoing: object;
  nNotGoing: number;

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
    this.nPartecipants = 0;
    this.nInterested = 0;
    this.nNotGoing = 0;

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
          if (this.partecipants[p] !== 'int') {
            this.nPartecipants++;
          }
          if (this.partecipants[p] === this.loggedUser) {
            this.alreadyPart = true;
          }
        }
      }

      for (const p in this.interested) {
        if (this.interested.hasOwnProperty(p)) {
          if (this.interested[p] !== 'int') {
            this.nInterested++;
          }
          if (this.interested[p] === this.loggedUser) {
            this.alreadyInterested = true;
          }
        }
      }

      for (const p in this.notGoing) {
        if (this.notGoing.hasOwnProperty(p)) {
          if (this.notGoing[p] !== 'int') {
            this.nNotGoing++;
          }
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

    lodash.isEmpty(this.partecipants) ? newPartecipantsObj = {} : newPartecipantsObj = this.partecipants;

    for (const part in newPartecipantsObj) {
      if (newPartecipantsObj.hasOwnProperty(part)) {
        newPartecipantsArr.push(newPartecipantsObj[part]);
      }
    }

    if (Object.values(newPartecipantsObj).indexOf(this.loggedUser) === -1) {
      newPartecipantsArr.push(this.loggedUser);
    }

    const partecipants = newPartecipantsArr.reduce((res, cur) => {
      res[cur] = cur;
      return res;
    }, {});

    this.removeIntOrNotGoing();

    this.managerDB.addPartecipant(this.id, partecipants).subscribe(arg => console.log(arg));
    alert('Congratulations, you\'ll partecipate to that event\nNow you\'ll be redirected to the dashboard');
    this.router.navigate(['/dashboard']).then();
  }

  interestedToEvent() {
    let interestedPartecipantsObj = {};
    const interestedPartecipantsArr = [];

    this.interested === {} ? interestedPartecipantsObj = {} : interestedPartecipantsObj = this.interested;

    for (const int in interestedPartecipantsObj) {
      if (interestedPartecipantsObj.hasOwnProperty(int)) {
        interestedPartecipantsArr.push(interestedPartecipantsObj[int]);
      }
    }

    if (Object.values(interestedPartecipantsObj).indexOf(this.loggedUser) === -1) {
      interestedPartecipantsArr.push(this.loggedUser);
    }

    const interested = interestedPartecipantsArr.reduce((res, cur) => {
      res[cur] = cur;
      return res;
    }, {});

    this.removePartOrNotGoing();

    this.managerDB.addInterested(this.id, interested).subscribe(arg => console.log(arg));
    alert('You\'re interested to this event\n You\'ll be recirected to the dashboard');
    this.router.navigate(['/dashboard']).then();
  }

  notGoingToEvent() {
    let notGoingPartecipantsObj = {};
    const notGoingPartecipantsArr = [];

    lodash.isEmpty(this.notGoing) ? notGoingPartecipantsObj = {} : notGoingPartecipantsObj = this.notGoing;

    for (const ng in notGoingPartecipantsObj) {
      if (notGoingPartecipantsObj.hasOwnProperty(ng)) {
        notGoingPartecipantsArr.push(notGoingPartecipantsObj[ng]);
      }
    }

    if (Object.values(notGoingPartecipantsObj).indexOf(this.loggedUser) === -1) {
      notGoingPartecipantsArr.push(this.loggedUser);
    }

    const notGoing = notGoingPartecipantsArr.reduce((res, cur) => {
      res[cur] = cur;
      return res;
    }, {});

    this.removePartOtInt();

    this.managerDB.addNotGoing(this.id, notGoing).subscribe(arg => console.log(arg));
    alert('You\'ll not go to the event\nYou\'ll be redirected to the dashboard');
    this.router.navigate(['/dashboard']).then();
  }

  removeIntOrNotGoing() {
    for (const int in this.interested) {
      if (this.interested.hasOwnProperty(int)) {
        if (this.loggedUser === this.interested[int]) {
          delete this.interested[int];
          if (lodash.isEmpty(this.interested)) {
            const interested = {
              interested: {
                null: 'int'
              }
            };
            this.managerDB.patchPeople(this.id, interested).subscribe(arg => console.log(arg));
          } else {
            const fireInterested = {interested: this.interested};
            this.managerDB.patchPeople(this.id, fireInterested).subscribe(arg => console.log(arg));
          }
          break;
        }
      }
    }

    for (const ng in this.notGoing) {
      if (this.notGoing.hasOwnProperty(ng)) {
        if (this.loggedUser === this.notGoing[ng]) {
          delete this.notGoing[ng];
          if (lodash.isEmpty(this.notGoing)) {
            const notGoing = {null: 'int'};
            this.managerDB.patchPeople(this.id, notGoing).subscribe(arg => console.log(arg));
          } else {
            const fireNotGoing = {notGoing: this.notGoing};
            this.managerDB.patchPeople(this.id, fireNotGoing).subscribe(arg => console.log(arg));
          }
          break;
        }
      }
    }
  }

  removePartOrNotGoing() {
    for (const part in this.partecipants) {
      if (this.partecipants.hasOwnProperty(part)) {
        if (this.loggedUser === this.partecipants[part]) {
          delete this.partecipants[part];
          if (lodash.isEmpty(this.partecipants)) {
            const partecipants = {
              partecipants: {
                null: 'int'
              }
            };
            this.managerDB.patchPeople(this.id, partecipants).subscribe(arg => console.log(arg));
          } else {
            const firePartecipants = {partecipants: this.partecipants};
            this.managerDB.patchPeople(this.id, firePartecipants).subscribe(arg => console.log(arg));
          }
          break;
        }
      }
    }

    for (const ng in this.notGoing) {
      if (this.notGoing.hasOwnProperty(ng)) {
        if (this.loggedUser === this.notGoing[ng]) {
          delete this.notGoing[ng];
          if (lodash.isEmpty(this.notGoing)) {
            const notGoing = {null: 'int'};
            this.managerDB.patchPeople(this.id, notGoing).subscribe(arg => console.log(arg));
          } else {
            const fireNotGoing = {notGoing: this.notGoing};
            this.managerDB.patchPeople(this.id, fireNotGoing).subscribe(arg => console.log(arg));
          }
          break;
        }
      }
    }
  }

  removePartOtInt() {
    for (const part in this.partecipants) {
      if (this.partecipants.hasOwnProperty(part)) {
        if (this.loggedUser === this.partecipants[part]) {
          delete this.partecipants[part];
          if (lodash.isEmpty(this.partecipants)) {
            const partecipants = {
              partecipants: {
                null: 'int'
              }
            };
            this.managerDB.patchPeople(this.id, partecipants).subscribe(arg => console.log(arg));
          } else {
            const firePartecipants = {partecipants: this.partecipants};
            this.managerDB.patchPeople(this.id, firePartecipants).subscribe(arg => console.log(arg));
          }
          break;
        }
      }
    }

    for (const int in this.interested) {
      if (this.interested.hasOwnProperty(int)) {
        if (this.loggedUser === this.interested[int]) {
          delete this.interested[int];
          if (lodash.isEmpty(this.interested)) {
            const interested = {
              interested: {
                null: 'int'
              }
            };
            this.managerDB.patchPeople(this.id, interested).subscribe(arg => console.log(arg));
          } else {
            const fireInterested = {interested: this.interested};
            this.managerDB.patchPeople(this.id, fireInterested).subscribe(arg => console.log(arg));
          }
          break;
        }
      }
    }
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
