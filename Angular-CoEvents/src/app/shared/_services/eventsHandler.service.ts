import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventsHandler {

  calendar: Subject<object[]> = new Subject();
  day: Subject<string> = new Subject();
  tags: Subject<object[]> = new Subject();

  constructor() { }

  pushCalendar(cal) {
    this.calendar.next(cal);
  }

  pushDay(day) {
    this.day.next(day);
  }

  pushTags(tags) {
    this.tags.next(tags);
  }

  getCalendar(): Observable<object[]> {
    return this.calendar.asObservable();
  }

  getDay(): Observable<string> {
    return this.day.asObservable();
  }

  getTags(): Observable<object[]> {
    return this.tags.asObservable();
  }
}
