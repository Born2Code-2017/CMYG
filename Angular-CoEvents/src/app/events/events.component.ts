import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { EventsHandler } from '../shared/_services/eventsHandler.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnChanges {

  private listEvents;
  private eventShowed;
  private tagsEvents: object[];

  @Input() today;

  constructor(private managerDB: ManagerDBModule,
              private eventsHandler: EventsHandler) {
    this.listEvents = [];
    this.eventShowed = [];
    this.tagsEvents = [];
  }

  ngOnChanges() {}

  ngOnInit() {
    this.managerDB.getEvents().subscribe(events => {
      this.listEvents = events;
      this.loadEvents(this.today, this.listEvents);
      this.sendTags();
    });

    this.getDay();
  }

  getDay() {
    this.eventsHandler.day.subscribe(date => {
      this.loadEvents(date, this.listEvents);
    });
  }

  loadEvents(date, events) {
    this.eventShowed = [];
    for (const event of events) {
      const start       = event.dateStart.split('-', 3),
            end         = event.dateEnd.split('-', 3),
            splicedDate = date.split('-', 3),
            newStart    = parseInt(start[2], 10),
            newEnd      = parseInt(end[2], 10),
            newDate     = parseInt(splicedDate[2], 10);

      if (event.dateStart === date || event.dateEnd === date || (newDate > newStart && newDate < newEnd)) {
        this.eventShowed.push(event);
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
