import { Component, Input, OnInit, Output } from '@angular/core';
import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { EventsHandler } from '../shared/_services/eventsHandler.service';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  animations: [
    trigger('loaded', [
      transition('* <=> *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(50%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(25%)', offset: 0.5}),
            style({opacity: 1, transform: 'translateY(0)', offset: 1}),
          ]))]), {optional: true})
      ])
    ])
  ]
})

export class EventsComponent implements OnInit {

  listEvents;
  eventShowed;
  tagsEvents: object[];
  tagsList;

  private firstLoad: boolean;

  @Input() today;
  @Output() userLogged;

  constructor(private managerDB: ManagerDBModule,
              private eventsHandler: EventsHandler) {
    this.listEvents = [];
    this.eventShowed = [];
    this.tagsEvents = [];
    this.tagsList = [];
  }

  ngOnInit() {
    this.listEvents = [];

    this.managerDB.getEvents().subscribe(events => {
      this.listEvents = events;
      this.managerDB.getTags().subscribe(tags => {
        this.tagsList = tags;
        this.onInitLoadEvents(this.today, this.listEvents, this.tagsList);
        this.sendTags();
      }, err => console.log('Something wrong in the subscribe of the getTags: ', err.status));
    }, err => console.log('Something wrong in the subscribe of the getEvents: ', err.status));

    this.onGetDay();
    this.onGetDashTagLoadEvents(this.today);
    this.firstLoad = true;
    this.userLogged = this.eventsHandler.getStaticUser();
  }

  onGetDay() {
    this.listEvents = [];

    this.eventsHandler.getDay().subscribe(date => {
      this.managerDB.getEvents().subscribe(events => {
        this.firstLoad = false;
        this.listEvents = events;
        this.onGetDayLoadEvents(date, this.listEvents, this.tagsList);
        this.onGetDashTagLoadEvents(date);
      });
    }, err => console.log('Something wrong in the subscribe of the getDay:', err.status));
  }

  onGetDashTagLoadEvents(date) {
    this.eventsHandler.getDashTagFilter().subscribe(tag => {
      this.loadEventsDashTag(date, this.listEvents, tag);
    }, err => console.log('Something wrong in the subscribe of the onGetDashTagLoadEvents: ', err.status));
  }

  onInitLoadEvents(date, events, tags) {
    this.eventShowed = [];
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const splittedDate    = date.split('-', 3),
              dateDay         = parseInt(splittedDate[2], 10),
              dateMonth       = parseInt(splittedDate[1], 10),
              eventDayStart   = events[event].dateStart.date.day,
              eventMonthStart = events[event].dateStart.date.month,
              eventDayEnd     = events[event].dateEnd.date.day,
              eventMonthEnd   = events[event].dateEnd.date.month,
              dateIsBetween   = eventDayStart >= dateDay || dateDay <= eventDayEnd,
              eventMonth      = eventMonthStart >= dateMonth || dateMonth <= eventMonthEnd,
              dateInRange     = dateIsBetween && eventMonth;

        if (dateInRange) {
          for (const tag of tags) {
            if (tag.name === events[event].tags) {
              events[event].colorTag = tag.color;
            }
          }

          events[event].id = event;
          this.eventShowed.push(events[event]);
        }
      }
    }
  }

  onGetDayLoadEvents(date, events, tags) {
    this.eventShowed = [];
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const eventDateStart = events[event].dateStart.formatted,
              eventDateEnd   = events[event].dateEnd.formatted,
              splittedDate   = date.split('-', 3);
        let dayOfDate = null;

        if (parseInt(splittedDate[2], 10) < 10) {
          dayOfDate = '0' + splittedDate[2];
        } else {
          dayOfDate = splittedDate[2];
        }

        const newDate = splittedDate[0] + '-' + splittedDate[1] + '-' + dayOfDate;

        for (const t of tags) {
          if (t.name === events[event].tags) {
            events[event].colorTag = t.color;
          }
        }

        if (eventDateStart === date || eventDateEnd === date || (newDate >= eventDateStart && newDate <= eventDateEnd)) {
          events[event].id = event;
          this.eventShowed.push(events[event]);
        }
      }
    }
  }

  loadEventsDashTag(date, events, tag) {
    this.eventShowed = [];
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const splittedDate    = date.split('-', 3),
              dateDay         = parseInt(splittedDate[2], 10),
              dateMonth       = parseInt(splittedDate[1], 10),
              eventDayStart   = events[event].dateStart.date.day,
              eventMonthStart = events[event].dateStart.date.month,
              eventDayEnd     = events[event].dateEnd.date.day,
              eventMonthEnd   = events[event].dateEnd.date.month,
              dateIsBetween   = eventDayStart >= dateDay && dateDay <= eventDayEnd,
              eventMonth      = eventMonthStart >= dateMonth || dateMonth <= eventMonthEnd,
              dateInRange     = dateIsBetween && eventMonth;

        if (dateInRange) {
          if (tag === events[event].tags || tag === 'all') {
            events[event].id = event;
            this.eventShowed.push(events[event]);
          }
        }
      }
    }
  }

  sendTags() {
    this.tagsEvents = [];

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

    this.eventsHandler.setTags(this.tagsEvents);
  }
}
