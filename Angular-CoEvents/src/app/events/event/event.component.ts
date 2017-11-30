import { Component, Input, OnInit } from '@angular/core';
import { ManagerDBModule } from '../../shared/_services/dbManager.service';
import { Router } from '@angular/router';
import { EventsHandler } from '../../shared/_services/eventsHandler.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  @Input() user;
  @Input() event;

  eventDate: string;
  eventDate2: string;
  loggedUser: string;

  private date = new Date();
  private today = this.date.getFullYear() +
    '-' + (this.date.getMonth() + 1) +
    '-' + this.date.getUTCDate();

  constructor(private managerDB: ManagerDBModule,
              private router: Router,
              private eventsHandler: EventsHandler) {
    this.eventDate = '';
    this.eventDate2 = '';
  }

  ngOnInit() {
    this.checkDate();
  }

  checkDate() {
    if (this.event.dateStart.formatted === this.event.dateEnd.formatted) {
      this.eventDate = this.event.dateEnd.formatted;
    } else {
      const dateS  = this.event.dateStart.formatted,
            dateE  = this.event.dateEnd.formatted,
            sDateS = dateS.split('-', 3),
            sDateE = dateE.split('-', 3);

      if (sDateS[1] === sDateE[1]) {
        this.eventDate2 = sDateS[2] + ' - ';
        this.eventDate = this.event.dateEnd.formatted;
      } else {
        this.eventDate2 = sDateS[2] + '/' + sDateS[1] + '/' + sDateS[0] + ' -';
        this.eventDate = this.event.dateEnd.formatted;
      }
    }
  }

  editEvent(event, url) {
    this.router.navigate(['/edit-event/' + url]).then(() => this.eventsHandler.setEditEvent(event));
  }

  deleteEvent(id) {
    this.managerDB.deleteEvent(id).subscribe(() => {
      alert('The event was deleted successfully. \n\n The page will reload the list.');
      this.eventsHandler.setDay(this.today);
    });
  }
}
