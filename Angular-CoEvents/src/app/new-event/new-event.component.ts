import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { NewEventGuard } from '../shared/_services/eventGuard.service';
import { EventsHandler } from '../shared/_services/eventsHandler.service';

import { INgxMyDpOptions } from 'ngx-mydatepicker';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})

export class NewEventComponent implements OnInit {

  h2: string;
  btnSend: string;
  loggedUser: string;

  // Label of the form
  lblName: boolean;
  lblLocation: boolean;
  lblImage: boolean;
  lblTag: boolean;

  // Dates
  eventDateStart: object;
  eventDateEnd: object;

  // Arrays
  arrayImages: object[];
  arrayTags;

  currentEvent;

  templateVisible: boolean;

  // Date Picker
  private today = new Date();
  private tomoz = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);

  private yearOfToday = this.today.getUTCFullYear();
  private monthOfToday = this.today.getUTCMonth() + 1;
  private dayOfToday = this.today.getUTCDate();

  private yearOfTomoz = this.tomoz.getUTCFullYear();
  private monthOfTomoz = this.tomoz.getUTCMonth() + 1;
  private dayOfTomoz = this.tomoz.getUTCDate();

  datePickerOpt: INgxMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    disableUntil: {
      year: this.yearOfToday,
      month: this.monthOfToday,
      day: this.today.getUTCDate() - 1
    }
  };

  constructor(private managerDB: ManagerDBModule,
              private router: Router,
              private eventGuard: NewEventGuard,
              private eventsHandler: EventsHandler) {
    this.lblName = false;
    this.lblLocation = false;
    this.lblImage = false;
    this.lblTag = false;

    this.templateVisible = false;

    this.arrayImages = [{
      name: 'Event',
      path: 'events.png'
    }, {
      name: 'Sunny Day',
      path: 'sunny.png'
    }, {
      name: 'Panorama',
      path: 'panorama.png'
    }];

    this.managerDB.getTags().subscribe(
      tags => this.arrayTags = tags,
      err => console.log('Error into Tag subscribe in new Event', err.status)
    );

    this.eventDateStart = {
      date: {
        year: this.yearOfToday,
        month: this.monthOfToday,
        day: this.dayOfToday
      },
      formatted: this.yearOfToday + '-' + this.monthOfToday + '-' + this.dayOfToday
    };

    this.eventDateEnd = {
      date: {
        year: this.yearOfTomoz,
        month: this.monthOfTomoz,
        day: this.dayOfTomoz
      },
      formatted: this.yearOfTomoz + '-' + this.monthOfTomoz + '-' + this.dayOfTomoz
    };

    this.eventsHandler.getUser().subscribe(user => {
      this.loggedUser = user;
    });

    if (this.router.url === '/new-event') {
      this.currentEvent = {
        name: '',
        location: '',
        dateStart: this.eventDateStart,
        dateEnd: this.eventDateEnd,
        timeStart: '',
        timeEnd: '',
        imgPath: '',
        tags: '',
        description: '',
        url: '',
        partecipants: '',
        interested: '',
        notGoing: ''
      };
      this.templateVisible = true;
    } else {
      this.eventsHandler.getEditEvent().subscribe(event => {
        this.currentEvent = event;
        this.templateVisible = true;
        this.labelMove();
        this.labelMoveSelectImage();
        this.labelMoveSelectTag();
      });
    }
  }

  ngOnInit() {
    if (this.router.url === '/new-event') {
      this.h2 = 'Create a new Event';
      this.btnSend = 'Publish!';
    } else {
      this.h2 = 'You\'re updating your event';
      this.btnSend = 'Update!';
    }
  }

  labelMove() {
    this.currentEvent.name.length >= 1 ? this.lblName = true : this.lblName = false;
    this.currentEvent.location.length >= 1 ? this.lblLocation = true : this.lblLocation = false;
  }


  labelMoveSelectImage() {
    this.currentEvent.imgPath.length >= 1 ? this.lblImage = true : this.lblImage = false;
  }

  labelMoveSelectTag() {
    this.currentEvent.tags.length >= 1 ? this.lblTag = true : this.lblTag = false;
  }

  nameToUrl() {
    this.currentEvent.url = this.currentEvent.name.replace(/ /g, '-').toLowerCase();
  }

  sendEventToDB() {
    const eventN = this.currentEvent;
    eventN.owner = this.loggedUser;
    eventN.colorTag = null;

    if (this.router.url === '/new-event') {
      this.managerDB.addEvent(eventN).subscribe(arg => {
        console.log(arg);
        this.eventGuard.getNewEvent(true);
        alert('Your Event was added, you\'ll be redirected to the Dashboard');
        this.router.navigateByUrl('/dashboard').then();
      }, err => console.log('Something wrong in the subscribe of the addEvent', err.status));
    } else {
      this.managerDB.patchEvent(this.currentEvent.id, eventN).subscribe(arg => {
        console.log(arg);
        this.eventGuard.getNewEvent(true);
        alert('Your Event was added, you\'ll be redirected to the Dashboard');
        this.router.navigateByUrl('/dashboard').then();
      }, err => console.log('Something wrong in the subscribe of the addEvent', err.status));
    }

  }

  clearInputs() {
    this.currentEvent.name = '';
    this.currentEvent.location = '';
    this.currentEvent.dateStart = this.eventDateStart;
    this.currentEvent.dateEnd = this.eventDateEnd;
    this.currentEvent.timeStart = '';
    this.currentEvent.timeEnd = '';
    this.currentEvent.description = '';
    this.currentEvent.url = '';
  }
}
