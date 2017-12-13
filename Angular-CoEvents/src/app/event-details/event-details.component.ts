import { Component, HostBinding, OnInit } from '@angular/core';
import { slideToTop } from '../router.animations';
import { EventsHandler } from '../shared/_services/eventsHandler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  currentEvent;
  id: string;
  partecipants;

  sameUser: boolean;
  loggedUser: string;
  alreadyPart: boolean;
  eventPathImg;
  avatarImg;

  constructor(private managerDB: ManagerDBModule,
              private eventsHandler: EventsHandler,
              private sanitizer: DomSanitizer,
              private router: Router,
              activatedRoute: ActivatedRoute) {

    this.sameUser = false;
    this.alreadyPart = false;

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

      this.eventPathImg = this.sanitizer.bypassSecurityTrustStyle(`url('/assets/img/${this.currentEvent.imgPath}')`);

      this.partecipants = this.currentEvent.partecipants;

      this.loggedUser = this.eventsHandler.getStaticUser();
      this.loggedUser === this.currentEvent.owner ? this.sameUser = true : this.sameUser = false;

      for (const p of this.partecipants) {
        if (p === this.loggedUser) {
          this.alreadyPart = true;
        }
      }
    });
  }

  ngOnInit() { }

  goingToEvent() {
    let newPartecipants = [];
    this.partecipants === '' ? newPartecipants = [] : newPartecipants = this.partecipants;

    console.log(newPartecipants);

    if (newPartecipants.indexOf(this.loggedUser) === -1) {
      newPartecipants.push(this.loggedUser);
    }

    const obj = newPartecipants.reduce(function (acc, cur, i) {
      acc[i] = cur;
      return acc;
    }, {});
    console.log(obj);

    this.managerDB.addPartecipant(this.id, obj).subscribe(arg => console.log(arg));
    alert('Congratulations, you\'ll partecipate to that event \n Now you\'ll be redirected to the dashboard');
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
