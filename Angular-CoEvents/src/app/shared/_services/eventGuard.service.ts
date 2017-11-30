import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { NewEventComponent } from '../../new-event/new-event.component';

@Injectable()
export class NewEventGuard implements CanDeactivate<NewEventComponent> {

  private bool: boolean;

  constructor() {
    this.bool = false;
  }

  confirmExit() {
    if (this.bool) {
      return true;
    } else {
      return confirm('You\'re trying to go somewhere else, are you sure about that? \n\n Any change won\'t be saved');
    }
  }

  getNewEvent(bool) {
    bool === true ? this.bool = true : this.bool = false;
  }

  canDeactivate(component: NewEventComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.confirmExit();
  }
}
