import { Component, OnInit } from '@angular/core';

import { Event } from '../shared/_models/events.model';
import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})

export class NewEventComponent implements OnInit {

  h2: string;
  loggedUser: string;

  // Label of the form
  lblName: boolean;
  lblLocation: boolean;
  lblDateStart: boolean;
  lblDateEnd: boolean;
  lblTimeStart: boolean;
  lblTimeEnd: boolean;
  lblImage: boolean;
  lblTag: boolean;

  // Input of the Form
  eventName: string;
  eventLocation: string;
  eventDateStart: string;
  eventDateEnd: string;
  eventTimeStart: string;
  eventTimeEnd: string;
  selectedImage: string;
  selectedTag: string;
  eventDescription: string;
  eventUrl: string;

  // Arrays
  arrayImages: object[];
  arrayTags;

  constructor(private managerDB: ManagerDBModule,
              private router: Router) {
    this.lblName = false;
    this.lblLocation = false;
    this.lblDateStart = false;
    this.lblDateEnd = false;
    this.lblTimeStart = false;
    this.lblTimeEnd = false;
    this.lblTag = false;

    this.eventName = '';
    this.eventLocation = '';
    this.eventDateStart = '';
    this.eventDateEnd = '';
    this.eventTimeStart = '';
    this.eventTimeEnd = '';
    this.arrayImages = [{
      name: 'Choose your image',
      path: ''
    }, {
      name: 'Event',
      path: 'events.png'
    }, {
      name: 'Sunny Day',
      path: 'sunny.png'
    }, {
      name: 'Panorama',
      path: 'panorama.png'
    }];

    this.managerDB.getTags().subscribe(tags => this.arrayTags = tags);
    this.eventDescription = '';
    this.eventUrl = '';
  }

  ngOnInit() {
    this.h2 = 'Create a new Event';
    this.getLoggedUser();
  }

  labelMove() {
    this.eventName.length >= 1 ? this.lblName = true : this.lblName = false;
    this.eventLocation.length >= 1 ? this.lblLocation = true : this.lblLocation = false;
    this.eventDateStart.length >= 1 ? this.lblDateStart = true : this.lblDateStart = false;
    this.eventDateEnd.length >= 1 ? this.lblDateEnd = true : this.lblDateEnd = false;
    this.eventTimeStart.length >= 1 ? this.lblTimeStart = true : this.lblTimeStart = false;
    this.eventTimeEnd.length >= 1 ? this.lblTimeEnd = true : this.lblTimeEnd = false;
  }

  labelMoveSelectImage() {
    this.selectedImage.length >= 1 ? this.lblImage = true : this.lblImage = false;
  }

  labelMoveSelectTag() {
    this.selectedTag.length >= 1 ? this.lblTag = true : this.lblTag = false;
  }

  getLoggedUser() {
    const sessionUser = JSON.parse(sessionStorage.getItem('loggedUser')),
          localUser   = JSON.parse(localStorage.getItem('loggedUser'));

    if (sessionUser) {
      this.loggedUser = sessionUser.username;
    }

    if (localUser) {
      this.loggedUser = localUser.username;
    }
  }

  nameToUrl() {
    this.eventUrl = this.eventName.replace(/ /g, '-').toLowerCase();
  }

  sendEventToDB() {
    this.nameToUrl();

    const event: Event = {
      name: this.eventName,
      location: this.eventLocation,
      dateStart: this.eventDateStart,
      dateEnd: this.eventDateEnd,
      timeStart: this.eventTimeStart,
      timeEnd: this.eventTimeEnd,
      imgPath: this.selectedImage,
      tags: this.selectedTag,
      description: this.eventDescription,
      url: this.eventUrl,
      owner: this.loggedUser,
      partecipants: '',
      interested: '',
      notGoing: ''
    };

    this.managerDB.addEvent(event).subscribe(arg => {
      console.log(arg);
      alert('Your Event was added, you\'ll be redirected to the Dashboard');
      this.router.navigateByUrl('/dashboard').then();
    }, err => console.log('Something wrong in the subscribe of the addEvent', err.status));
  }
}
