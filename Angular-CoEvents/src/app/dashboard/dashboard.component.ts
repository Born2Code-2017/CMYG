import { Component, HostBinding, HostListener, OnInit, Output } from '@angular/core';
import { EventsHandler } from '../shared/_services/eventsHandler.service';
import { NewEventGuard } from '../shared/_services/eventGuard.service';
import { routerTransition } from '../router.animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [routerTransition]
})

export class DashboardComponent implements OnInit {

  @HostBinding('@routerTransition') routerTransition;

  tagsOfToday;
  tags;

  date = new Date();
  @Output() today = this.date.getFullYear() +
    '-' + (this.date.getMonth() + 1) +
    '-' + this.date.getUTCDate();

  todayEvents: string;

  constructor(private eventsHandler: EventsHandler,
              private eventGuard: NewEventGuard) {
    this.todayEvents = 'Discover Events';
    this.tagsOfToday = [];
    this.tags = [];
  }

  ngOnInit() {
    this.eventGuard.getNewEvent(false);

    this.eventsHandler.getTags().subscribe(tags => {
      this.tags = tags;
      for (const t of this.tags) {
        if (this.tagsOfToday.indexOf(t.tags) === -1) {
          this.tagsOfToday.push(t.tags);
        }
      }
    });

    this.onGetDay();
  }

  onGetDay() {
    this.eventsHandler.getDay().subscribe(date => {
      const d = date.split('-', 3);
      this.todayEvents = d[2] + '/' + d[1] + ' events';
      this.tagsOfToday = [];

      for (const t of this.tags) {
        const start       = t.dateStart.formatted.split('-', 3),
              end         = t.dateEnd.formatted.split('-', 3),
              splicedDate = date.split('-', 3),
              newStart    = parseInt(start[2], 10),
              newEnd      = parseInt(end[2], 10),
              newDate     = parseInt(splicedDate[2], 10);

        if (t.dateStart.formatted === date || t.dateEnd.formatted === date || (newDate >= newStart && newDate <= newEnd)) {
          if (this.tagsOfToday.indexOf(t.tags) === -1) {
            this.tagsOfToday.push(t.tags);
          }
        }
      }
    });
  }

  clickedTag(tag) {
    this.eventsHandler.setDashTagFilter(tag);
  }
}
