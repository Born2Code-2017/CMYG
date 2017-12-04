import { Component, Input, OnInit } from '@angular/core';
import { EventsHandler } from '../shared/_services/eventsHandler.service';
import { ManagerDBModule } from '../shared/_services/dbManager.service';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  animations: [
    trigger('loaded', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(':enter', stagger('300ms', [
          animate('.4s ease-in', keyframes([
            style({opacity: 0, transform: 'translateX(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateX(35px)', offset: 0.3}),
            style({opacity: 1, transform: 'translateX(0)', offset: 1}),
          ]))]), {optional: true})
      ])
    ])
  ]
})

export class CalendarComponent implements OnInit {

  @Input() howMuchDays: number;
  arrayCalendar: object[];
  tags;
  tagsColor;

  constructor(private eventsHandler: EventsHandler,
              private managerDB: ManagerDBModule) {
    this.arrayCalendar = [];
    this.tags = [];
    this.tagsColor = [];
  }

  ngOnInit() {
    this.eventsHandler.getTags().subscribe(tags => {
      this.displayCalendar(tags);
    });
    this.managerDB.getTags().subscribe(colors => this.tagsColor = colors);
  }

  displayCalendar(tags) {
    this.arrayCalendar = [];
    const MILLIS_IN_DAY = 1000 * 60 * 60 * 24,
          day           = new Date(),
          week          = ['sun', 'mon', 'tue', 'wen', 'thu', 'fry', 'sat'],
          todayD        = day.getUTCDay(),
          todayN        = day.getTime();

    for (let i = 0; i < this.howMuchDays; i++) {
      const this_week  = ((todayD + i) % 7),
            newDate    = new Date(todayN + MILLIS_IN_DAY * i),
            nDay       = newDate.getUTCDate(),
            month      = newDate.getMonth() + 1,
            year       = newDate.getFullYear(),
            actualDate = year + '-' + month + '-' + nDay;

      for (const t of tags) {
        const start    = t.dateStart.formatted.split('-', 3),
              end      = t.dateEnd.formatted.split('-', 3),
              newStart = parseInt(start[2], 10),
              newEnd   = parseInt(end[2], 10);

        if (t.dateStart.formatted === actualDate || t.dateEnd.formatted === actualDate || (nDay >= newStart && nDay <= newEnd)) {
          for (const c of this.tagsColor) {
            if (c.name === t.tags) {
              if (this.tags.map(arg => arg.tags).indexOf(t.tags) === -1) {
                const tmpTag = {
                  tags: t.tags,
                  color: c.color
                };
                this.tags.push(tmpTag);
              }
            }
          }
        }
      }

      const objDate = {
        day: nDay,
        month: month,
        year: year,
        lblDay: week[this_week],
        tags: this.tags
      };

      this.arrayCalendar.push(objDate);
      this.tags = [];
    }
  }

  setDay(day) {
    this.eventsHandler.setDay(day);
  }

}
