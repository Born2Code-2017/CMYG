import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UsersInterface } from '../_interfaces/usersInterface';
import { EventsInterface } from '../_interfaces/events-interface';
import { TagsInterface } from '../_interfaces/tags-interface';

@Injectable()
export class ManagerDBModule {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'https://coevents-cmyg.firebaseio.com/';
  }

  getUsers() {
    const url = this.apiUrl + 'users.json';
    return this.http.get<UsersInterface>(url);
  }

  getEvents() {
    const url = this.apiUrl + 'events.json';
    return this.http.get<EventsInterface>(url);
  }

  getTags() {
    const url = this.apiUrl + 'tags.json';
    return this.http.get<TagsInterface>(url);
  }

  isUserLogged() {
    if (sessionStorage.getItem('loggedUser') || localStorage.getItem('loggedUser')) {
      return true;
    }
  }
}
