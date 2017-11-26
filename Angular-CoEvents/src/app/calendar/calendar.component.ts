import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Input() howMuchDays: number;

  private arrayCalendar: object[];
  private numberDay: number;
  private labelDay: string;

  constructor() {
    this.arrayCalendar = [];
  }

  ngOnInit() {
    this.displayCalendar();
  }

  displayCalendar() {
    const MILLIS_IN_DAY = 1000 * 60 * 60 * 24,
          day           = new Date(),
          week          = ['sun', 'mon', 'tue', 'wen', 'thu', 'fry', 'sat'],
          todayD        = day.getUTCDay(),
          todayN        = day.getTime();

    for (let i = 0; i < this.howMuchDays; i++) {
      const this_week = ((todayD + i) % 7),
            dayMore   = new Date(todayN + MILLIS_IN_DAY * i).getUTCDate();

      this.numberDay = dayMore;
      this.labelDay = week[this_week];

      const objDate = {
        number: this.numberDay,
        day: this.labelDay
      };

      this.arrayCalendar.push(objDate);
    }
    console.log(this.arrayCalendar);
  }

}
