import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { NewEventGuard } from '../shared/_services/eventGuard.service';
import { EventsHandler } from '../shared/_services/eventsHandler.service';

import { INgxMyDpOptions } from 'ngx-mydatepicker';
import { slideToTop } from '../router.animations';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css'],
  animations: [slideToTop]
})

export class NewEventComponent implements OnInit {

  @HostBinding('@slideToTop') slideToTop;

  h2: string;
  btnSend: string;
  btnCancel: string;
  loggedUser: string;

  // Label of the form
  lblName: boolean;
  lblLocation: boolean;
  lblImage: boolean;
  lblTag: boolean;

  // Dates
  eventDateStart: object;
  eventDateEnd: object;
  leadingZeroToday: string;
  leadingZeroTomorrow: string;

  // Arrays
  arrayImages: object[];
  arrayTags;

  currentEvent;

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

  public optionsFroala: Object = {
    charCounterCount: true,
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'formatOL', 'formatUL'],
    toolbarButtonsXS: ['fullscreen', 'bold', 'italic', 'underline', 'formatOL', 'formatUL'],
    toolbarButtonsSM: ['fullscreen', 'bold', 'italic', 'underline', 'formatOL', 'formatUL'],
    toolbarButtonsMD: ['fullscreen', 'bold', 'italic', 'underline', 'formatOL', 'formatUL'],
  };

  constructor(private managerDB: ManagerDBModule,
              private router: Router,
              private route: ActivatedRoute,
              private eventGuard: NewEventGuard,
              private eventsHandler: EventsHandler) {
    this.lblName = false;
    this.lblLocation = false;
    this.lblImage = false;
    this.lblTag = false;

    this.arrayImages = [{
      name: 'Meeting',
      path: 'meeting.jpg'
    }, {
      name: 'Office Desk',
      path: 'computer.jpg'
    }, {
      name: 'Office',
      path: 'office.jpg'
    }, {
      name: 'Party',
      path: 'party.jpg'
    }, {
      name: 'Bottle of Wine',
      path: 'wine.jpg'
    }, {
      name: 'Lounge Bar',
      path: 'bar.jpg'
    }, {
      name: 'Baloons',
      path: 'baloons.jpg'
    }, {
      name: 'Launch',
      path: 'launch.jpg'
    }, {
      name: 'Celebration',
      path: 'celebration.jpg'
    }];

    this.managerDB.getTags().subscribe(
      tags => this.arrayTags = tags,
      err => console.log('Error into Tag subscribe in new Event', err.status)
    );

    if (this.dayOfToday < 10) {
      this.leadingZeroToday = '0';
    }

    if (this.dayOfTomoz < 10) {
      this.leadingZeroTomorrow = '0';
    }

    this.eventDateStart = {
      date: {
        year: this.yearOfToday,
        month: this.monthOfToday,
        day: this.dayOfToday
      },
      formatted: this.yearOfToday + '-' + this.monthOfToday + '-' + this.leadingZeroToday + this.dayOfToday
    };

    this.eventDateEnd = {
      date: {
        year: this.yearOfTomoz,
        month: this.monthOfTomoz,
        day: this.dayOfTomoz
      },
      formatted: this.yearOfTomoz + '-' + this.monthOfTomoz + '-' + this.leadingZeroTomorrow + this.dayOfTomoz
    };

    this.loggedUser = this.eventsHandler.getStaticUser();

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
    } else {
      this.currentEvent = this.eventsHandler.getEditEvent();
      this.labelMove();
      this.labelMoveSelectImage();
      this.labelMoveSelectTag();
    }
  }

  ngOnInit() {
    if (this.router.url === '/new-event') {
      this.h2 = 'Create a new Event';
      this.btnSend = 'Publish!';
      this.btnCancel = 'Clear Inputs';
    } else {
      this.h2 = 'You\'re updating your event';
      this.btnSend = 'Update!';
      this.btnCancel = 'Back to Dashboard without edit';
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
    this.currentEvent.url = this.currentEvent.name
      .replace(/ /g, '-')
      .replace(/[.,:;&%$!"?|^_*()]/g, '')
      .replace(/à/g, 'a')
      .replace(/[éè]/g, 'e')
      .replace(/ì/g, 'i')
      .replace(/ò/g, 'o')
      .replace(/ù/g, 'u')
      .toLowerCase();
    // console.log(this.currentEvent.url);
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
        alert('Your Event was patched, you\'ll be redirected to the Dashboard');
        this.router.navigateByUrl('/dashboard').then();
      }, err => console.log('Something wrong in the subscribe of the addEvent', err.status));
    }
  }

  clearInputs() {
    if (this.router.url === '/new-event') {
      this.currentEvent.name = '';
      this.currentEvent.location = '';
      this.currentEvent.dateStart = this.eventDateStart;
      this.currentEvent.dateEnd = this.eventDateEnd;
      this.currentEvent.timeStart = '';
      this.currentEvent.timeEnd = '';
      this.currentEvent.description = '';
      this.currentEvent.url = '';
    } else {
      alert('Operation dismissed as requested. \n\n You\'ll be redirected to the Dashboard');
      this.eventGuard.getNewEvent(true);
      this.router.navigate(['/dashboard']).then();
    }
  }
}
