import { Component, OnInit, Output } from '@angular/core';
import { EventsHandler } from '../shared/_services/eventsHandler.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private date = new Date();
  @Output() today = this.date.getFullYear() +
    '-' + (this.date.getMonth() + 1) +
    '-' + this.date.getDate();

  todayEvents: string;

  constructor(private eventsHandler: EventsHandler) {
    this.todayEvents = 'Today\'s Events';
  }

  ngOnInit() {
    this.eventsHandler.day.subscribe(date => {
      const d = date.split('-', 3);
      this.todayEvents = d[2] + '/' + d[1] + ' events';
    });
  }
}
