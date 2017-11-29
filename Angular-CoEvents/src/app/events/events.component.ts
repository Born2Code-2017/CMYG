import { Component, Input, OnInit } from '@angular/core';
import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { EventsHandler } from '../shared/_services/eventsHandler.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {

  listEvents;
  eventShowed;
  tagsEvents: object[];
  tagsList;

  private firstLoad: boolean;

  @Input() today;

  constructor(private managerDB: ManagerDBModule,
              private eventsHandler: EventsHandler) {
    this.listEvents = [];
    this.eventShowed = [];
    this.tagsEvents = [];
    this.tagsList = [];
  }

  ngOnInit() {
    this.managerDB.getEvents().subscribe(events => {
      this.listEvents = events;
      this.managerDB.getTags().subscribe(tags => {
        this.tagsList = tags;
        this.loadEvents(this.today, this.listEvents, this.tagsList);
        this.sendTags();
      }, err => console.log('Something wrong in the subscribe of the getTags: ', err.status));
    }, err => console.log('Something wrong in the subscribe of the getEvents: ', err.status));

    this.getDay();
    this.getDashTagFromService(this.today);
    this.firstLoad = true;
  }

  getDay() {
    this.eventsHandler.getDay().subscribe(date => {
      this.firstLoad = false;
      this.onLoadEvents(date, this.listEvents, this.tagsList);
      this.getDashTagFromService(date);
    }, err => console.log('Something wrong in the subscribe of the getDay:', err.status));
  }

  getDashTagFromService(date) {
    this.eventsHandler.getDashTagFilter().subscribe(tag => {
      this.loadEventsDashTag(date, this.listEvents, tag);
    }, err => console.log('Something wrong in the subscribe of the getDashTagFromService: ', err.status));
  }

  loadEvents(date, events, tags) {
    this.eventShowed = [];
    for (const event in events) {

      if (events.hasOwnProperty(event)) {
        for (const t of tags) {
          if (t.name === events[event].tags) {
            events[event].colorTag = t.color;
          }
        }

        if (events[event].dateStart >= date) {
          this.eventShowed.push(events[event]);
        }
      }
    }
  }

  onLoadEvents(date, events, tags) {
    this.eventShowed = [];
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const start       = events[event].dateStart.split('-', 3),
              end         = events[event].dateEnd.split('-', 3),
              splicedDate = date.split('-', 3),
              newStart    = parseInt(start[2], 10),
              newEnd      = parseInt(end[2], 10),
              newDate     = parseInt(splicedDate[2], 10);

        for (const t of tags) {
          if (t.name === events[event].tags) {
            events[event].colorTag = t.color;
          }
        }

        if (events[event].dateStart === date || events[event].dateEnd === date || (newDate >= newStart && newDate <= newEnd)) {
          this.eventShowed.push(events[event]);
        }
      }
    }
  }

  loadEventsDashTag(date, events, tag) {
    this.eventShowed = [];
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const eventStart    = events[event].dateStart.split('-', 3),
              eventEnd      = events[event].dateEnd.split('-', 3),
              splicedDate   = date.split('-', 3),
              newStart      = parseInt(eventStart[2], 10),
              newEnd        = parseInt(eventEnd[2], 10),
              newDate       = parseInt(splicedDate[2], 10),
              dataInizio    = events[event].dateStart === date,
              dataFine      = events[event].dateEnd === date,
              dataIsBetween = newDate >= newStart && newDate <= newEnd,
              dateIsInRange = dataInizio || dataFine || dataIsBetween;

        let dataStartMonths = false;

        if (this.firstLoad) {
          dataStartMonths = newStart >= newDate || splicedDate[1] < eventEnd[1];
        } else {
          dataStartMonths = newStart >= newDate && splicedDate[1] < eventEnd[1];
        }

        if (dateIsInRange || dataStartMonths) {
          if (tag === events[event].tags || tag === 'all') {
            this.eventShowed.push(events[event]);
          }
        }
      }
    }
  }

  sendTags() {
    for (const e in this.listEvents) {
      if (this.listEvents.hasOwnProperty(e)) {
        const tmpTags = {
          tags: this.listEvents[e].tags,
          dateStart: this.listEvents[e].dateStart,
          dateEnd: this.listEvents[e].dateEnd
        };

        this.tagsEvents.push(tmpTags);
      }
    }

    this.eventsHandler.pushTags(this.tagsEvents);
  }
}
