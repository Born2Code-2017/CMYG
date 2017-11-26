import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  @Input() event;
  private eventDate: string;

  constructor() {
    this.eventDate = '';
  }

  ngOnInit() {
    console.log(event);
    if (this.event.dateStart === this.event.dateEnd) {
      this.eventDate = this.event.dateEnd;
      this.event.dateStart = '';
      this.event.dateEnd = '';
    } else {
      const dateS  = this.event.dateStart,
            dateE  = this.event.dateEnd,
            sDateS = dateS.split('-', 3),
            sDateE = dateE.split('-', 3);

      if (sDateS[1] === sDateE[1]) {
        this.event.dateStart = sDateS[2] + ' - ';
      }
    }
  }

}
