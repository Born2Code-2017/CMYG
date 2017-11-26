import { Component, Input, OnInit } from '@angular/core';
import { ManagerDBModule } from '../shared/_services/dbManager.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  private listEvents;
  @Input() today;

  constructor(private managerDB: ManagerDBModule) {
    this.listEvents = [];
  }

  ngOnInit() {
    this.managerDB.getEvents().subscribe(events => this.loadEvents(this.today, events));
  }


  loadEvents(date, events) {
    for (const event of events) {
      if (event.dateStart === date || event.dateEnd === date) {
       this.listEvents.push(event);
      }
    }
  }
}
