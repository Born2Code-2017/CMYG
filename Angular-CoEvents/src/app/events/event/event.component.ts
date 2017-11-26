import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  @Input() event;
  private eventDate: string;
  private eventDate2: string;

  constructor() {
    this.eventDate = '';
    this.eventDate2 = '';
  }

  ngOnInit() {
    this.checkDate();
  }

  checkDate() {
    if (this.event.dateStart === this.event.dateEnd) {
      this.eventDate = this.event.dateEnd;
    } else {
      const dateS  = this.event.dateStart,
            dateE  = this.event.dateEnd,
            sDateS = dateS.split('-', 3),
            sDateE = dateE.split('-', 3);

      if (sDateS[1] === sDateE[1]) {
        this.eventDate2 = sDateS[2] + ' - ';
        this.eventDate = this.event.dateEnd;
      }
    }
  }
}
