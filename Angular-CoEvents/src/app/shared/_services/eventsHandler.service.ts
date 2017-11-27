import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventsHandler {

  calendar: Subject<object[]> = new Subject();
  day: Subject<string> = new Subject();
  tags: Subject<object[]> = new Subject();
  dashTagFilter: Subject<string> = new Subject();

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

  pushDashTagFilter(tag) {
    this.dashTagFilter.next(tag);
  }

  getDashTagFilter(): Observable<string> {
    return this.dashTagFilter.asObservable();
  }

  getDay(): Observable<string> {
    return this.day.asObservable();
  }

  getTags(): Observable<object[]> {
    return this.tags.asObservable();
  }
}
