import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventsHandler {

  day: Subject<string> = new Subject();
  tags: Subject<object[]> = new Subject();
  dashTagFilter: Subject<string> = new Subject();
  loggedUser: Subject<string> = new Subject();
  staticUser: string;
  editEvent: object;

  constructor() { }

  setDay(day) {
    this.day.next(day);
  }

  getDay(): Observable<string> {
    return this.day.asObservable();
  }

  setTags(tags) {
    this.tags.next(tags);
  }

  getTags(): Observable<object[]> {
    return this.tags.asObservable();
  }

  setDashTagFilter(tag) {
    this.dashTagFilter.next(tag);
  }

  getDashTagFilter(): Observable<string> {
    return this.dashTagFilter.asObservable();
  }

  setUser(user) {
    this.loggedUser.next(user);
    this.setStaticUser(user);
  }

  getUser(): Observable<string> {
    return this.loggedUser.asObservable();
  }

  setStaticUser(user) {
    this.staticUser = user;
  }

  getStaticUser() {
    return this.staticUser;
  }

  setEditEvent(event) {
    this.editEvent = event;
  }

  getEditEvent() {
    return this.editEvent;
  }

}
