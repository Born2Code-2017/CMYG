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
      });
    });

    this.getDay();
    this.getDashTagFromService(this.today);
  }

  getDay() {
    this.eventsHandler.getDay().subscribe(date => {
      this.onLoadEvents(date, this.listEvents, this.tagsList);
      this.getDashTagFromService(date);
    });
  }

  getDashTagFromService(date) {
    this.eventsHandler.getDashTagFilter().subscribe(tag => {
      this.loadEventsDashTag(date, tag, this.listEvents);
    });
  }

  loadEvents(date, events, tags) {
    this.eventShowed = [];
    for (const event of events) {

      for (const t of tags) {
        if (t.name === event.tags) {
          event.colorTag = t.color;
        }
      }

      if (event.dateStart >= date) {
        this.eventShowed.push(event);
      }
    }
  }

  onLoadEvents(date, events, tags) {
    this.eventShowed = [];
    for (const event of events) {
      const start       = event.dateStart.split('-', 3),
            end         = event.dateEnd.split('-', 3),
            splicedDate = date.split('-', 3),
            newStart    = parseInt(start[2], 10),
            newEnd      = parseInt(end[2], 10),
            newDate     = parseInt(splicedDate[2], 10);

      for (const t of tags) {
        if (t.name === event.tags) {
          event.colorTag = t.color;
        }
      }

      if (event.dateStart === date || event.dateEnd === date || (newDate >= newStart && newDate <= newEnd)) {
        this.eventShowed.push(event);
      }
    }
  }

  loadEventsDashTag(date, tag, events) {
    this.eventShowed = [];
    for (const event of events) {
      const eventStart      = event.dateStart.split('-', 3),
            eventEnd        = event.dateEnd.split('-', 3),
            splicedDate     = date.split('-', 3),
            newStart        = parseInt(eventStart[2], 10),
            newEnd          = parseInt(eventEnd[2], 10),
            newDate         = parseInt(splicedDate[2], 10),
            dataInizio      = event.dateStart === date,
            dataFine        = event.dateEnd === date,
            dataIsBetween   = newDate >= newStart && newDate <= newEnd,
            dataStartMonths = newStart >= newDate || splicedDate[1] < eventEnd[1],
            dateIsInRange   = dataInizio || dataFine || dataIsBetween;

      if (dateIsInRange || dataStartMonths) {
        if (tag === event.tags || tag === 'all') {
          this.eventShowed.push(event);
        }
      }
    }
  }

  sendTags() {
    for (const e of this.listEvents) {
      const tmpTags = {
        tags: e.tags,
        dateStart: e.dateStart,
        dateEnd: e.dateEnd
      };

      this.tagsEvents.push(tmpTags);
    }

    this.eventsHandler.pushTags(this.tagsEvents);
  }
}
