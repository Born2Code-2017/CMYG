import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class EventsHandler {

  calendar: EventEmitter<object[]> = new EventEmitter();
  day: EventEmitter<number> = new EventEmitter();
  tags: EventEmitter<object[]> = new EventEmitter();

  constructor() { }

  pushCalendar(cal) {
    this.calendar.emit(cal);
  }

  pushDay(day) {
    this.day.emit(day);
  }

  pushTags(tags) {
    this.tags.emit(tags);
  }
}
