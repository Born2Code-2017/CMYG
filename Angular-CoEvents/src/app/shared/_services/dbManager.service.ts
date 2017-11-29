import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { UsersInterface } from '../_interfaces/usersInterface';
import { EventsInterface } from '../_interfaces/events-interface';
import { TagsInterface } from '../_interfaces/tags-interface';

@Injectable()
export class ManagerDBModule {

  private apiUrl: string;

  // private apiTest: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'https://coevents-cmyg.firebaseio.com/';
    // this.apiTest = 'https://testguichdb.firebaseio.com/';
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

  addEvent(event) {
    const url = this.apiUrl + 'events.json';
    return this.http.post(url, event);
  }

  // get the event into the json in firebase with the KEY.
  // getSingleEvent(id) {
  //   const url = this.apiUrl + 'events.json?orderBy="$key"&startAt=\"' + id + '\"&endAt=\"' + id + '\"';
  //   console.log(url);
  //   return this.http.get(url);
  // }
  //
  // delete the event into the JSON in FIREBASE based on the its INDEX.
  // deleteInFire(id) {
  //   const url = this.apiUrl + 'events/' + id + '.json';
  //   return this.http.delete(url);
  // }

  isUserLogged() {
    if (sessionStorage.getItem('loggedUser') || localStorage.getItem('loggedUser')) {
      return true;
    }
  }
}
