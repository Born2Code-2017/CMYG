import { Component, OnInit, Output } from '@angular/core';
import { EventsHandler } from '../shared/_services/eventsHandler.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private tagsOfToday;
  private tags;

  private date = new Date();
  @Output() today = this.date.getFullYear() +
    '-' + (this.date.getMonth() + 1) +
    '-' + this.date.getUTCDate();

  todayEvents: string;

  constructor(private eventsHandler: EventsHandler) {
    this.todayEvents = 'Discover Events';
    this.tagsOfToday = [];
    this.tags = [];
  }

  ngOnInit() {
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
        const start       = t.dateStart.split('-', 3),
              end         = t.dateEnd.split('-', 3),
              splicedDate = date.split('-', 3),
              newStart    = parseInt(start[2], 10),
              newEnd      = parseInt(end[2], 10),
              newDate     = parseInt(splicedDate[2], 10);

        if (date === t.dateStart || date === t.dateEnd || (newDate >= newStart && newDate <= newEnd)) {
          this.tagsOfToday.push(t.tags);
        }
      }
    });
  }

  clickedTag(tag){
    this.eventsHandler.pushDashTagFilter(tag);
  }
}
